import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import createHttpError from 'http-errors';
import routes from './routes/index.js';

dotenv.config();
const app = express(); // create express app;

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan("dev"));
}

app.use(helmet()); // helmet
app.use(express.json()); // parse json url
app.use(express.urlencoded({ extended: true })); // parse json body
app.use(mongoSanitize());
app.use(cookieParser()); // enable cookie parser
app.use(compression());
app.use(fileUpload({ useTempFiles: true }));
app.use(cors());

app.use('/api/v1',routes);

app.use(async (req, res, next)=>{
    next(createHttpError.NotFound('This route does not exist'));
})

// error handling route
app.use(async(err,req, res,next)=>{
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

export default app;