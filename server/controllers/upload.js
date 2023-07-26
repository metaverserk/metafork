import { db } from '../connect.js';
import { promisify } from 'util';
import multer from 'multer';
import axios from 'axios';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';



dotenv.config();

cloudinary.config({ 
  cloud_name: 'diywv4q1r', 
  api_key: '814611139939763', 
  api_secret: '9bDyg70-jQr2S8xvdEmibpj2wng' 
});


ffmpeg.setFfmpegPath(ffmpegPath);

const queryPromise = promisify(db.query).bind(db);
const upload = multer({ storage: multer.memoryStorage() });


// Загрузка аватара
export const uploadAvatar = async (req, res) => {
    try {
      upload.single('file')(req, res, async (error) => {
        if (error) {
          console.log(error);
          return res.status(400).send({ error: 'Ошибка при загрузке файла' });
        }
        const fileData = req.file.buffer;
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
  
        // Получение токена из БД
        const query = `SELECT authToken FROM authData`;
        const result = await queryPromise(query);
        const authToken = result[0].authToken;
  
        // Сжатие и обрезка изображения
        
        const compressedImage = await sharp(fileData)
          .resize(800, 800, { fit: 'cover' })
          .webp({ quality: 60 })
          .toBuffer();
  
        await axios.put(`https://api.selcdn.ru/v1/SEL_260513/metafork/avatars/${uniqueName}`, compressedImage, {
          headers: {
            'Content-Type': 'image/webp',
            'X-Auth-Token': authToken
          }
        });
        
        const url = `https://897821.selcdn.ru/metafork/avatars/${uniqueName}`;
        res.send(url);
      });
    } catch (error) {
      console.log(error);
    }
};


// Загрузка изображения к посту
export const uploadPostImage = async (req, res) => {
    try {
      upload.single('file')(req, res, async (error) => {
        if (error) {
          console.log(error);
          return res.status(400).send({ error: 'Ошибка при загрузке файла' });
        }

        if (req.file.size > 30000000) {
          return res.status(400).send({ error: 'Размер файла превышает 30 МБ' });
        }

        if (!['image/jpg', 'image/png', 'image/webp', 'image/jpeg'].includes(req.file.mimetype)) {
          return res.status(400).send({ error: 'Неподдерживаемый формат файла' });
        }

        const fileData = req.file.buffer;
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
  
        // Получение токена из БД
        const query = `SELECT authToken FROM authData`;
        const result = await queryPromise(query);
        const authToken = result[0].authToken;
  
        // Сжатие и обрезка изображения
        const compressedImage = await sharp(fileData)
          .resize(1024, 1024, { fit: 'inside' })
          .webp({ quality: 90 })
          .toBuffer();
  
        await axios.put(`https://api.selcdn.ru/v1/SEL_260513/metafork/posts/${uniqueName}`, compressedImage, {
          headers: {
            'Content-Type': 'image/webp',
            'X-Auth-Token': authToken
          }
        });
        
        const url = `https://897821.selcdn.ru/metafork/posts/${uniqueName}`;
        res.set('Content-Type', 'image/webp');
        res.send(url);
      });
    } catch (error) {
      console.log(error);
    }
};

// Загрузка видео к посту
// export const uploadPostVideo = async (req, res) => {
//   try {
//     // Мультипарсинг для обработки запросов на загрузку файлов
//     upload.single('file')(req, res, async (error) => {
//       if (error) {
//         console.log(error);
//         return res.status(400).send({ error: 'Ошибка при загрузке файла' });
//       }
 
//       // Проверка на размер файла
//       if (req.file.size > 30000000) {
//         return res.status(400).send({ error: 'Размер файла превышает 30 МБ' });
//       }

//       // Проверка на формат файла
//       if (!['video/mp4', 'video/quicktime', 'video/avi'].includes(req.file.mimetype)) {
//         return res.status(400).send({ error: 'Неподдерживаемый формат файла' });
//       }
      
//       // Получение буфера видео
//       const fileData = req.file.buffer;
//       const randomName = Math.random().toString(36).substring(2, 15);

//       const filePath = `./temp/video-${randomName}.mp4`;
//       fs.writeFileSync(filePath, fileData);

//       // Получение длительности видео
//       const info = await ffprobe(filePath, { path: ffprobeStatic.path });
//       const duration = parseFloat(info.streams[0].duration); // Длительность первого потока
      

//       // Проверка длительности видео (в секундах)
//       if (duration > 60) {
//         fs.unlinkSync(filePath);
//         return res.status(400).send({ error: 'Длительность видео превышает 1 минуту' });
//       }

//       // Формирование пути файла
//       const serverFilePath = `${process.env.SERVER_URL}/temp/video-${randomName}.mp4`;
//       //const serverFilePath = `${req.protocol}://${req.get('host')}/temp/video-${randomName}.mp4`;
//       const finalPath = `./temp/compressed-${randomName}.mp4`;

//       // Сжатие видео
//       const compressedData = await new Promise((resolve, reject) => {

//       ffmpeg(serverFilePath)
//         .size('720x720')        // Установка размера
//         .outputOptions(['-movflags', 'faststart', '-pix_fmt', 'yuv420p']) // Дополнительные параметры
        
//         .outputFormat('mp4')    // Установка формата
//         .on('error', (err) => reject(err))
//         .on('end', () => resolve(finalPath))
//         .toFormat('mp4')        // Формат сжатого видео
//         .save(finalPath); // Сохраняем файл на сервере
        
//       });

//       const compressedBuffer = fs.readFileSync(compressedData);

//       // // Получение токена из БД
//       const query = `SELECT authToken FROM authData`;
//       const result = await queryPromise(query);
//       const authToken = result[0].authToken;

//       // Загрузка видео на сервер
//       const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.mp4`;
//       await axios.put(`https://api.selcdn.ru/v1/SEL_260513/metafork/posts/${uniqueName}`, compressedBuffer, {
//         headers: {
//           'Content-Type': 'video/mp4',
//           'X-Auth-Token': authToken
//         }
//       });

//       fs.unlinkSync(filePath);
//       fs.unlinkSync(finalPath);

//       const url = `https://897821.selcdn.ru/metafork/posts/${uniqueName}`;
//       res.set('Content-Type', 'video/mp4');
//       res.send(url);
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).send({ error: 'Ошибка при загрузке и сжатии файла' });
//   }
// }






// Загрузка видео к посту
// export const uploadPostVideo = async (req, res) => {
//   try {
//     // Мультипарсинг для обработки запросов на загрузку файлов
//     upload.single('file')(req, res, async (error) => {
//       if (error) {
//         console.log(error);
//         return res.status(400).send({ error: 'Ошибка при загрузке файла' });
//       }
 
//       // Проверка на размер файла
//       if (req.file.size > 30000000) {
//         return res.status(400).send({ error: 'Размер файла превышает 30 МБ' });
//       }

//       // Проверка на формат файла
//       if (!['video/mp4', 'video/quicktime', 'video/avi'].includes(req.file.mimetype)) {
//         return res.status(400).send({ error: 'Неподдерживаемый формат файла' });
//       }
      
//       // Получение буфера видео
//       const fileData = req.file.buffer;
//       const randomName = Math.random().toString(36).substring(2, 15);

//       // Сохранение файла на диск сервера
//       const filePath = `./temp/video-${randomName}.mp4`;
//       fs.writeFileSync(filePath, fileData);
//       const serverFilePath = `${process.env.SERVER_URL}/temp/video-${randomName}.mp4`;

//       const finalPath = `./temp/compressed-${randomName}.mp4`;

//       // Сжатие видео
//       const compressedData = await new Promise((resolve, reject) => {
//         ffmpeg()
//           .input(serverFilePath)
//           .inputOptions("-threads 1")
//           .size('720x720')
//           .outputOptions(['-movflags', 'frag_keyframe+empty_moov', '-pix_fmt', 'yuv420p'])
//           .outputFormat('mp4')
//           //.outputOptions('-c:v', 'libx264') // Использование кодека H.264
//           .outputOptions('-crf', '30') // Установка качества чем выше тем хуже
//           .outputOptions('-preset', 'veryslow') // Установка скорости сжатия
//           .outputOptions('-strict', '-2') // Разрешение использования экспериментальных кодеков
//           //.outputOptions('-loglevel', 'debug') // Добавить опцию отладки ffmpeg в outputOptions
//           .outputOptions('-nostdin') // Добавление флага -nostdin
//           .on('error', (err) => reject(err))
//           .on('end', () => resolve(finalPath))
//           //.on('stderr', (stderrLine) => console.log(stderrLine)) // Вывод ошибок в консоль
//           .save(finalPath);
//       });



      
      
//       const compressedBuffer = fs.readFileSync(compressedData);


//       // Получение токена из БД
//       const query = `SELECT authToken FROM authData`;
//       const result = await queryPromise(query);
//       const authToken = result[0].authToken;

//       // Загрузка видео на сервер
//       const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.mp4`;
//       await axios.put(`https://api.selcdn.ru/v1/SEL_260513/metafork/posts/${uniqueName}`, compressedBuffer, {
//         headers: {
//           'Content-Type': 'video/mp4',
//           'X-Auth-Token': authToken
//         }
//       });

//       // Удаление файла с диска сервера
//       fs.unlinkSync(filePath);
//       fs.unlinkSync(finalPath);


//       const url = `https://897821.selcdn.ru/metafork/posts/${uniqueName}`;
//       res.set('Content-Type', 'video/mp4');
//       res.send(url);
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).send({ error: 'Ошибка при загрузке и сжатии файла' });
//   }
// }
























export const uploadPostVideo = async (req, res) => {
  try {
    // Мультипарсинг для обработки запросов на загрузку файлов
    upload.single('file')(req, res, async (error) => {
      if (error) {
        console.log(error);
        return res.status(400).send({ error: 'Ошибка при загрузке файла' });
      }
 
      // Проверка на размер файла
      if (req.file.size > 40000000) {
        return res.status(400).send({ error: 'Размер файла превышает 40 МБ' });
      }

      // Проверка на формат файла
      if (!['video/mp4', 'video/quicktime'].includes(req.file.mimetype)) {
        return res.status(400).send({ error: 'Неподдерживаемый формат файла' });
      }

      
     
        

        // Получение буфера видео
        const fileData = req.file.buffer;
        const randomName = Math.random().toString(36).substring(2, 15);
      
        // Сохранение файла на диск сервера
        const filePath = `./temp/video-${randomName}.mp4`;
        fs.writeFileSync(filePath, fileData);
        const serverFilePath = `${process.env.SERVER_URL}/temp/video-${randomName}.mp4`;

        // Получение длительности видео
        const info = await ffprobe(filePath, { path: ffprobeStatic.path });
        const duration = parseFloat(info.streams[0].duration); // Длительность первого потока


        // Проверка длительности видео (в секундах)
        if (duration > 120) {
          fs.unlinkSync(filePath);
          return res.status(400).send({ error: 'Слишком длинное видео' });
        }


      
        // Сжатие видео через Cloudinary
        const compressFile = await cloudinary.v2.uploader.upload(serverFilePath, {
          resource_type: 'video',
          public_id: randomName,
          overwrite: true,
          quality: '85',
          transformation: [
            {width: 860, crop: "scale"},
          ]
        }); 


        // Получение ссылки на сжатое видео
        const compressedUrl = compressFile.url;


        // Скачивание сжатого видео
        const videoData = await axios.get(compressedUrl, {
          responseType: 'arraybuffer'
        });

        const videoBuffer = videoData.data;



        // Получение токена из БД
        const query = `SELECT authToken FROM authData`;
        const result = await queryPromise(query);
        const authToken = result[0].authToken;

        // Загрузка видео на сервер
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.mp4`;
        await axios.put(`https://api.selcdn.ru/v1/SEL_260513/metafork/posts/${uniqueName}`, videoBuffer, {
          headers: {
            'Content-Type': 'video/mp4',
            'X-Auth-Token': authToken
          }
        });

        // Удаление файла с диска сервера
        fs.unlinkSync(filePath);



        const url = `https://897821.selcdn.ru/metafork/posts/${uniqueName}`;
        res.set('Content-Type', 'video/mp4');
        res.send(url);
      
        
 
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: 'Ошибка при загрузке и сжатии файла' });
  }
}






























