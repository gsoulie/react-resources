import React, { useState } from 'react';

const PhoneNumberInput: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const formatPhoneNumber = (value: string): string => {
    // Supprime les espaces et les caractères non numériques
    const cleanedValue = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

    // Ajoute un espace tous les deux chiffres
    let formattedNumber = '';
    for (let i = 0; i < cleanedValue.length; i += 2) {
      if (i > 0) {
        formattedNumber += ' ';
      }
      formattedNumber += cleanedValue.substr(i, 2);
    }
    return formattedNumber;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const formattedValue = formatPhoneNumber(inputValue);
    setPhoneNumber(formattedValue);
  };

  return (
    <div>
      <label htmlFor="phone">Numéro de téléphone :</label>
      <input
        type="text"
        id="phone"
        name="phone"
        maxLength={14}
        placeholder="06 05 04 03 02"
        value={phoneNumber}
        onChange={handleInputChange}
        required
      />
    </div>
  );
};

export default PhoneNumberInput;
