import React, { useEffect } from 'react';

const VisibilityChangeChecker = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert('Bạn đã chuyển tab!');
      }
    };

    // Lắng nghe sự kiện visibilitychange
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div>
      <h1>Kiểm tra chuyển tab</h1>
      <p>Giữ tab này để tránh cảnh báo!</p>
    </div>
  );
};

export default VisibilityChangeChecker;
