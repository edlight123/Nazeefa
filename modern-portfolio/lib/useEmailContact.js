'use client';

import { useState } from 'react';

const EMAIL = 'nazeefa.ahm@gmail.com';

export function useEmailContact() {
  const [showCopied, setShowCopied] = useState(false);

  const handleEmailClick = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      window.location.href = `mailto:${EMAIL}`;
      return;
    }

    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`, '_blank');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(EMAIL).then(() => {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 3000);
      });
    }
  };

  return { showCopied, handleEmailClick };
}
