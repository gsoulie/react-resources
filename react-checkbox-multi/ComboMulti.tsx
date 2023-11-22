import React, { useEffect, useState } from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap';
import './ComboMulti.scss';
import { ComboMultiItem } from './ComboMultiItem';
import { ComboMultiButton } from './ComboMultiButton';
import { Texts } from '@/helpers/texts/texts';

export type ComboOptionMutli = {
  id: string;
  label: string;
  checked?: boolean;
};

export type ComboMultiType = {
  id: string;
  disabled?: boolean;
  defaultOptionLabel?: string;
  defaultOptionId?: string;
  defaultValue?: string;
  aria: string;
  options: ComboOptionMutli[];
  handleChange: (id: string, isChecked: boolean) => void;
};

export const ComboMulti = (props: ComboMultiType) => {

  const [selectedItems, setSelectedItems] = useState<string[]>(props.options.filter(item => item.checked === true).map(el => el.id));

  // Fonction qui récupère la liste des libellés des droits cochés de l'utilisateur
  const fetchSelectedItemLabel = (): string[] => {
    let labels: string[] = [];
    selectedItems.forEach((item) => {
      const itemDataFound = props.options.find(i => i.id === item);
      if (itemDataFound) {
        labels.push(itemDataFound.label);
      }
    });
    return labels;
  }

  // initialisation des données
  useEffect(() => {
    setSelectedItems(props.options.filter(item => item.checked === true).map(el => el.id));
  }, [props.options]);

  return (
    <div className="overlay-trigger__wrapper">
      <OverlayTrigger
        trigger="click"
        key="bottom"
        placement="bottom"
        rootClose
        overlay={
          <Popover id={props.id} className="combo-overlay">
            <Popover.Body>
              {props.options.map((option) => (
                <ComboMultiItem
                  key={option.id}
                  label={option.label}
                  id={option.id}
                  checked={option.checked}
                  handleCheck={(checked) => props.handleChange(option.id, checked)}
                />
              ))}
            </Popover.Body>
          </Popover>
        }
      >
        <button style={{ minWidth: '200px' }} className="btn-combo-multi" disabled={props.disabled}>
          <ComboMultiButton
            label={
              selectedItems.length > 0
                ? fetchSelectedItemLabel().join(", ")
                : props.defaultOptionLabel ||
                Texts.inputs.comboMultiDefaultLabel
            }
          />
        </button>
      </OverlayTrigger>
    </div>
  );
}
