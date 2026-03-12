import {
  Modal,
  IngredientDetails as IngredientDetailsComponent
} from '@components';
import { useNavigate, useNavigation } from 'react-router-dom';

export const IngredientDetailsModal = () => {
  const navigate = useNavigate();

  const onClose = () => {
    navigate(-1);
  };

  return (
    <Modal title='Детали ингредиента' onClose={onClose}>
      <IngredientDetailsComponent />
    </Modal>
  );
};
