import './ComboMulti.scss';
import { Form } from 'react-bootstrap';

export type ComboMultiItemType = {
  id: string,
  checked?: boolean,
  label: string,
  handleCheck: (checked: boolean) => void
}

export const ComboMultiItem = (props: ComboMultiItemType) => {

  const handleClick = (ev: any) => {
    const checked = ev.target.checked;
    props?.handleCheck(checked);
  };

  return (
    <div className="checkbox-item">
      <Form>
        <Form.Check
          id={props.id}
          type="checkbox"
          checked={props.checked}
          onChange={handleClick}
          label={props.label}
        />
      </Form>
    </div>
  );
}
