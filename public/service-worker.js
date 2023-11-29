// /* eslint-disable no-restricted-globals */

// self.addEventListener('install', (event) => {
//     console.log('Service Worker 설치됨');
//   });
  
//   self.addEventListener('fetch', (event) => {
//     console.log('요청 캐치됨:', event.request.url);
//   });  

//   export function register() {
//     if ('serviceWorker' in navigator) {
//       window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/serviceWorker.js').then((registration) => {
//           console.log('Service Worker 등록 성공:', registration.scope);
//         }, (err) => {
//           console.log('Service Worker 등록 실패:', err);
//         });
//       });
//     }
//   }

// service-worker.js

// 이벤트 리스너 설치
self.addEventListener('install', (event) => {
  // 설치 관련 작업
  console.log('Service Worker 설치됨');
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', (event) => {
  // 네트워크 요청을 가로채서 캐시 로직을 처리하거나
  // 기타 작업을 수행할 수 있습니다.
  console.log('요청 캐치됨:', event.request.url);
});

// 기타 필요한 이벤트 리스너들을 추가합니다.
