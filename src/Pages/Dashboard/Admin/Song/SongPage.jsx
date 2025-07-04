import React, { useEffect, useRef, useState } from 'react';
import { useGet } from '../../../../Hooks/useGet';
import { usePost } from '../../../../Hooks/usePostJson';
import { LoaderLogin, SubmitButton, UploadInput } from '../../../../Components/Components';
import { useTranslation } from "react-i18next";

const SongPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchSong, loading: loadingSong, data: dataSong } = useGet({
    url: `${apiUrl}/admin/settings/notification_sound`,
  });
  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/admin/settings/notification_sound_update`,
  });

  const songRef = useRef();
  const audioRef = useRef();
  const [song, setSong] = useState('');
  const [songFile, setSongFile] = useState(null);
  const [songFileOld, setSongFileOld] = useState(null);
                 const {  t,i18n } = useTranslation();

  // Fetch data from the API
  useEffect(() => {
    refetchSong();
  }, [refetchSong]);

  // Update song source when API data is received
  useEffect(() => {
    if (dataSong && dataSong.notification_sound) {
      setSongFileOld(dataSong.notification_sound);
      console.log('Fetched song from API:', dataSong.notification_sound);
    }
  }, [dataSong]);

  // Handle user-uploaded file
  const handleSongChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSongFile(file);
      setSong(URL.createObjectURL(file));
    }
  };

  const handleSongClick = (ref) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (songFile) {
        URL.revokeObjectURL(song);
      }
    };
  }, [songFile]);

  // Update state after successful response
  useEffect(() => {
    if (!loadingPost && response) {
      setSongFileOld(song);
      setSongFile(null);
      setSong('');
    }
  }, [loadingPost, response]);

  const handleChangeSound = (e) => {
    e.preventDefault();

    if (!songFile) {
      auth.toastError(t('Please upload a new notification sound.')); // Replace with toast or better notification
      return;
    }

    const formData = new FormData();
    formData.append('notification_sound', songFile);

    console.log('FormData:', ...formData.entries());
    postData(formData, t('Sound Changed Successfully'));
  };

  return (
    <>
      {loadingPost || loadingSong ? (
        <div className="flex items-center justify-center w-full">
          <LoaderLogin />
        </div>
      ) : (
        <section>
          <form onSubmit={handleChangeSound}>
            {/* Audio Element */}
            <div className="flex items-center gap-x-2">
              {songFileOld && (
                <div className="flex items-center justify-start mb-4 sm:w-full gap-y-4">
                  <span className="text-xl font-TextFontRegular text-thirdColor">{t("Your Sound")}:</span>
                  <audio
                    className="ml-3 drop-shadow"
                    ref={audioRef}
                    src={songFileOld || ''}
                    controls
                    onError={() => console.error(t('Audio failed to load. Please try again.'))}
                  />
                </div>
              )}
            </div>

            {/* Upload Input */}
            <div className="sm:w-full lg:w-[30%] flex flex-col items-start justify-center gap-y-1">
              <UploadInput
                value={songFile ? songFile.name : t('Upload Notification Sound')}
                uploadFileRef={songRef}
                placeholder={t("Upload Notification Sound")}
                handleFileChange={handleSongChange}
                onClick={() => handleSongClick(songRef)}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end w-full gap-x-4">
              <div className="">

                <SubmitButton
                  text={t('Change')}
                  rounded="rounded-full"
                  handleClick={handleChangeSound}
                  disabled={!songFile} // Disable button until a file is selected
                />
              </div>
            </div>
          </form>
        </section>
      )}
    </>
  );
};

export default SongPage;