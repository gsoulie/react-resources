import "./ComboMulti.scss";

export type ComboMultiButtonType = {
  label: string
}

export const ComboMultiButton = (props: ComboMultiButtonType) => {
  return (
    <div className="btn-combo__wrapper">
      <div className="btn-combo__wrapper-content px-3">
        {props.label}
      </div>
    </div>
  );
};
