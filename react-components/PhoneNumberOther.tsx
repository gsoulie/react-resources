
const PhoneNumberInput = ({ value }: { value: string }) => {
  const { register, handleSubmit } = useForm();

  const updateValue = (e: any) => {
    const { value } = e.target;
    e.target.value = normalizePhoneNumber(value)
  };

  const normalizePhoneNumber = (value: string) => {
    const cleanedValue = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    return (
      cleanedValue
        ?.replace(/\s/g, "")
        .match(/.{1,2}/g)
        ?.join(" ")
        ?.substring(0, 14) || ""
    );
  }

  return (
    <input
      id="phone"
      name="phone"
      onChange={updateValue}
      placeholder="__ __ __ __ __"
      type="tel"
      inputMode="numeric"
      autoComplete="cc-number"
      defaultValue={normalizePhoneNumber(value)}
    />
  );
};


const App = () => {
  return <PhoneNumberInput value={"0605040203"} />
}
