import express from 'express';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import viewsRouter from './routes/views.js';
import path from 'path';
import __dirname, { generateProduct } from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import MessagesManager from './dao/mongoDb/MessageManager.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import sessionsRouter from './routes/sessions.js';
import usersRouter from './routes/users.js';
import passport from 'passport';
import initializePassport from './config/passport.js';
import cookieParser from 'cookie-parser';
import config from './config/config.js';
import errorHandler from './middlewares/errors/index.js';
import { addLogger, devLogger, prodLogger } from './services/log/logger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import cors from 'cors';

const messagesManager = new MessagesManager();

const mongoURL = config.mongoUrl;
const PORT = config.port;
const logger = config.logger === 'DEV' ? devLogger : prodLogger;
const app = express();
const ACCEPT_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:8081',
  'exp://192.168.1.40:8081'
];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ACCEPT_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cookie',
      'Origin',
      'X-Requested-With',
      'Accept',
      'X-Access-Token',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Credentials',
      'Access-Control-Expose-Headers',
      'X-API-KEY',
      'Access-Control-Request-Headers',
      'Access-Control-Request-Method'
    ]
  })
);
app.use(addLogger);
app.use('/static', express.static(path.join(__dirname, '/public')));
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'handlebars');
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongoURL,
      ttl: 1800
    }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    name: 'session',
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    }
  })
);
initializePassport();
app.use(passport.initialize());

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Ecommerce API',
      description: 'API para ecommerce'
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
};

const specs = swaggerJSDoc(swaggerOptions);

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);
app.get('/mockingproducts', async (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProduct());
  }
  res.send({ status: 'success', payload: products });
});
app.get('/loggertest', (req, res) => {
  req.logger.fatal('Fatal desde el logger');
  req.logger.error('Error desde el logger');
  req.logger.warning('Warning desde el logger');
  req.logger.info('Info desde el logger');
  req.logger.http('Http desde el logger');
  req.logger.debug('Debug desde el logger');
  res.json('Mensaje de prueba desde el logger');
});
app.use('/', viewsRouter);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`Servidor ON http://localhost:${PORT}`);
});

const io = new Server(server);

const usuariosConectados = {};

io.on('connection', (socket) => {
  logger.debug('Cliente conectado');
  socket.on('disconnect', () => {
    logger.debug('Cliente desconectado');
    if (socket.id in usuariosConectados) {
      const usuarioDesconectado = usuariosConectados[socket.id];
      socket.broadcast.emit('userDisconnected', usuarioDesconectado);
      delete usuariosConectados[socket.id];
    }
  });

  socket.emit('server:updatedProducts');
  socket.on('client:updateProduct', () => {
    io.emit('server:updatedProducts');
  });

  socket.emit('server:updatedUsers');
  socket.on('client:updateUser', () => {
    io.emit('server:updatedUsers');
  });

  socket.on('nuevousuario', async (nombreUsuario) => {
    usuariosConectados[socket.id] = nombreUsuario;
    socket.broadcast.emit('broadcast', nombreUsuario);
    socket.emit('chat', await messagesManager.getMessages());
  });
  socket.on('mensaje', async (info) => {
    await messagesManager.createMessage(info);
    io.emit('chat', await messagesManager.getMessages());
  });
});

export default app;
