import { cards } from '../../Solar/en/ModalWindowCards/cardsEN';

// Функция поиска модели по UUID во всех категориях
const findModelByUuid = (uuid) => {
  for (const category in cards) {
    const model = cards[category].find((item) => item.uuid === uuid);
    if (model) return model;
  }
  return null;
};

export const Conditions = ({ uuid }) => {
  const model = findModelByUuid(uuid);

  if (!model) {
    return (
      <div className="Conditions-Restrictins-div">
        <h3>Model Constraints</h3>
        <p>No data found for this model.</p>
      </div>
    );
  }

  // Значения по умолчанию для параметров модели
  const {
    damping = 0.85, // значение по умолчанию
    n_0 = [],
    n_pos = [],
    n_neg = [],
  } = model;

  // Функция для форматирования списка значений
  const formatList = (arr) => {
    if (!arr || arr.length === 0) return '—';
    return arr.join(', ');
  };

  return (
    <div className="Conditions-Restrictins-div">
      <h3>Model Constraints</h3>
      <p>
        Damping-Factor: δ= {damping.toFixed(2)} &emsp; &emsp; Constraints to
        impacts: &emsp; N(0): {formatList(n_0)} &emsp; N(+): {formatList(n_pos)}
        &emsp; N(-): {formatList(n_neg)}
      </p>
    </div>
  );
};
