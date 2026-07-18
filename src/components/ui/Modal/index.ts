import { ModalBase } from './Modal';
import { ModalHeader } from './ModalHeader';
import { ModalBody } from './ModalBody';
import { ModalFooter } from './ModalFooter';

export const Modal = Object.assign(ModalBase, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});

export * from './Modal';
export * from './ModalHeader';
export * from './ModalBody';
export * from './ModalFooter';
