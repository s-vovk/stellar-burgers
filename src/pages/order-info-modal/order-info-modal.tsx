import { Modal, OrderInfo as OrderInfoComponent } from '@components';
import { useNavigate, useParams } from 'react-router-dom';

export const OrderInfoModal = () => {
  const navigate = useNavigate();
  const { number } = useParams();

  const onClose = () => {
    navigate(-1);
  };

  return (
    <Modal title={`#${number}`} onClose={onClose}>
      <OrderInfoComponent isModal />
    </Modal>
  );
};
