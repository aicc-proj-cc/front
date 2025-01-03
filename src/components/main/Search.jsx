// import React, { useState } from 'react';
// import axios from 'axios';

// const Search = ({ onCharacterFollowed }) => {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState('');

//   const API_SEARCH_URL = 'http://127.0.0.1:8000/api/characters/search';
//   const API_BASE_URL = 'http://127.0.0.1:8000/api';

//   const handleSearch = async () => {
//     setError('');
//     setResults([]);
//     try {
//       const response = await axios.get(API_SEARCH_URL, {
//         params: { query },
//         headers: { 'Content-Type': 'application/json' },
//       });
//       if (response.data && Array.isArray(response.data)) {
//         setResults(response.data);
//       } else {
//         setError('검색 결과가 없습니다.');
//       }
//     } catch (err) {
//       setError('검색 중 오류가 발생했습니다.');
//     }
//   };

//   const handleButtonClick = async (
//     characterId,
//     characterName,
//     characterDescription
//   ) => {
//     const token = localStorage.getItem('authToken');
//     const userId = localStorage.getItem('userId');

//     if (!token || !userId) {
//       alert('로그인이 필요한 서비스입니다.');
//       return;
//     }

//     try {
//       const payload = { user_idx: parseInt(userId, 10), char_idx: characterId };
//       await axios.post(
//         `http://127.0.0.1:8000/users/${userId}/follow`,
//         payload,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // 즉시 업데이트
//       if (onCharacterFollowed) {
//         onCharacterFollowed({
//           name: characterName,
//           description: characterDescription,
//         });
//       }

//       alert(`${characterName}가 성공적으로 팔로우되었습니다!`);
//     } catch (err) {
//       console.error('팔로우 중 문제가 발생했습니다:', err);
//       alert('팔로우 중 문제가 발생했습니다.');
//     }
//   };

//   return (
//     <div className="bg-gray-900 min-h-screen flex flex-col items-center p-6 text-white">
//       <h1 className="text-3xl font-bold mb-6">캐릭터 검색</h1>

//       <div className="flex w-full max-w-md mb-6">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="캐릭터 이름을 입력하세요"
//           className="flex-1 p-3 rounded-l-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={handleSearch}
//           className="p-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           검색
//         </button>
//       </div>

//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       {results.length > 0 && (
//         <div className="w-full max-w-md space-y-4">
//           {results.map((character) => (
//             <div
//               key={character.id}
//               className="p-4 bg-gray-800 rounded-md shadow-md"
//             >
//               <h2 className="text-xl font-bold">{character.name}</h2>
//               <p className="text-gray-400">{character.description}</p>
//               <button
//                 onClick={() =>
//                   handleButtonClick(
//                     character.id,
//                     character.name,
//                     character.description
//                   )
//                 }
//                 className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
//               >
//                 팔로우
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Search;
