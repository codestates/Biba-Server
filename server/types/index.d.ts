import { IncomingHttpHeaders } from 'http';

declare module 'http' {
  interface IncomingHttpHeaders {
    token?: string;
  }
}

// req.file.location 설정
declare global {
  namespace Express {
    namespace Multer {
      interface File {
        location: string;
      }
      
      interface Request {
        /** `Multer.File` object populated by `single()` middleware. */
        file: Multer.File;
        /**
         * Array or dictionary of `Multer.File` object populated by `array()`,
         * `fields()`, and `any()` middleware.
         */
        files: {
            [fieldname: string]: Multer.File[];
        } | Multer.File[];
      }
    }
  }
}
