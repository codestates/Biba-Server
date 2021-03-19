/*
1. 위조 방지 상태 토큰 생성
2. Google에 인증 요청 보내기(완)
3. 위조 방지 상태 토큰 확인
4. code액세스 토큰 및 ID 토큰 교환
5. ID 토큰에서 사용자 정보 얻기
6. 사용자 인증
*/

//declare Express, import
import * as express from 'express';
import * as User from '../models';
import * as jwt from 'jsonwebtoken';
// import * as axios from 'axios';
import axios, { AxiosResponse } from "axios";

//middleware
const router = express.Router();

// TODO: 
// db 에 저장하는 token 이 필요없다
// db 에 저장하는 refresh_token 찾아보기
// 서버에서 가지고 있는 토큰이다.
// access_token 없이 사용하는 구조이므로, 다시 확인하기!

// * GET /socials/google
// ggsignup 
// NOTE: 기능? Google에 인증 요청 보내기
// token 필요!
router.get('/ggsignup', (req, res) => {
  return res
  .status(301) // 301(영구 이동): 요청한 페이지를 새 위치로 영구적으로 이동했다. GET 또는 HEAD 요청에 대한 응답으로 이 응답을 표시하면 요청자가 자동으로 새 위치로 전달된다.
  .redirect(`https://accounts.google.com/o/oauth2/v2/auth?\
  scope=https://www.googleapis.com/auth/analytics&\
  response_type=code&\   
  client_id=${process.env.GOOGLE_CLIENT_ID}&\
  redirect_uri=${process.env.GOOGLE_REDIRECT_URI}`) 
});

// 참고: https://developers.google.com/identity/protocols/oauth2/openid-connect#setredirecturi
// 참고: https://developers.google.com/oauthplayground/



// * GET /socials/google
// registered
router.get('/register', (req, res) => {
  const token = req.body.id_token;
  // console.log('token: ', token);
  const decoded_data = jwt.verify(
    token,
    'jwt_secret_key'
    // process.env.ACCESS_SECRET + Date().split(' ')[2] // *
  );
  console.log('decoded_data: ', decoded_data);
  // const email = decoded_data.accout;
  // NOTE: 아래 callback 해서 token 받아오는 작업끝난 다음 register 작업하기

});



// * GET /socials/google
// ggcallback
// NOTE: callback 을 통해 access_token  토근을 얻는게 목적
// 구글에서 아래 사이트에 Post로 보내서 토큰을 가져온다
router.get('/ggcallback', (req, res) => {
  // axios.defaults.withCredentials = true; // NOTE: cookie 사용하면 설정하기!
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const client_pd = process.env.GOOGLE_CLIENT_PD;
  // const code = req.query.code; 
  const code = '4%2F5gHS5aK0opnHyxVR7Ii48sxzrv44_Vx8Z2pYGOlQhLsBdNqheEUCfZIMNxuZVWusExwzFmZKBdp1rHv0tp4Ew-Y';

  axios({
    method: 'post',
    url: `https://accounts.google.com/o/oauth2/v2/auth?\
    
    client_id=${process.env.GOOGLE_CLIENT_ID}&\
    client_pd=${process.env.GOOGLE_CLIENT_PD}&\
    response_type=${code}&`,
    headers: {
      accept: 'application/json',
    },
    // scope=https://www.googleapis.com/auth/analytics&\
  })
  .then((response: any) => {
    if (response === undefined) {
      console.log('response: ', response);
      return res.status(401).send('Access failed');
    }
    const access_token = response.data.access_token;
  })
});

export = router;

// code 받으면 redirect 로 주소변경