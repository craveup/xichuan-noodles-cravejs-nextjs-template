import { useState } from 'react';

function useDisclosure() {
  const [isOpen, setIsOpen] = useState(false); // 768px is usually the breakpoint for mobile

  return {
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onToggle: () => setIsOpen((prev) => !prev),
    setOpen: setIsOpen,
  };
}

export default useDisclosure;
