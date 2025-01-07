import React, { useEffect, useState } from 'react';

const Wordcloud = () => {
  const [characterWordcloud, setCharacterWordcloud] = useState({
    imageUrl: '',
    loading: true,
    error: null,
  });

  useEffect(() => {
    let imageObjectUrl; // Blob URL을 저장

    const fetchWordcloud = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/wordcloud`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.detail || 'Failed to load character wordcloud'
          );
        }

        const imageBlob = await response.blob();
        imageObjectUrl = URL.createObjectURL(imageBlob);
        setCharacterWordcloud({
          imageUrl: imageObjectUrl,
          loading: false,
          error: null,
        });
      } catch (error) {
        setCharacterWordcloud({
          imageUrl: '',
          loading: false,
          error: error.message,
        });
      }
    };

    fetchWordcloud();

    // Cleanup only when component is unmounted
    return () => {
      if (imageObjectUrl) {
        URL.revokeObjectURL(imageObjectUrl);
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-8 bg-primary p-6 text-white">
      <section className="bg-sub p-6">
        <h2 className="text-2xl font-bold mb-4">깐부 캐릭터 워드클라우드</h2>
        {characterWordcloud.loading && !characterWordcloud.error ? (
          <div className="bg-sub p-4 text-center">Loading...</div>
        ) : characterWordcloud.error ? (
          <div className="bg-[#d9534f] p-4 text-center text-white">
            Error: {characterWordcloud.error}
          </div>
        ) : (
          <div className="bg-sub p-4">
            <img
              src={characterWordcloud.imageUrl}
              alt="Characters Wordcloud"
              className="mx-auto bg-sub rounded-lg shadow-lg"
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default Wordcloud;
