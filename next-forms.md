[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Formulaires

## Formulaire avec Yup et React form

````typescript
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const POSTAL_CODE_REGEX = /^(?:[0-8]\d|9[0-8])\d{3}$/g;

// definition du schéma
const schema = yup.object().shape({
  addressLine1: yup.string().required("Le champ adresse ligne 1 est requis").default(""),
  addressLine2: yup.string().default(""),
  addressLine3: yup.string().default(""),
  postalCode: yup.string().matches(POSTAL_CODE_REGEX, "Le code postal n'est pas au bon format"),
  city: yup.string(),
});

export const AddressForm = (props: { address: AddressDTO }) => {
  const { address } = props;
  
  // states de contrôle des états du formulaire
  const { address } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Binding React form avec le schéma Yup et les données initiale
 const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: async () =>
      schema.cast({
        addressLine1: address?.numero,
        addressLine2: address?.nomRue,
        addressLine3: address?.complement,
        postalCode: address?.codePostal,
        city: address?.ville,
      }),
    mode: "onSubmit",
  });

// pré-remplissage formulaire si mode édition par exemple
  useEffect(() => {
    if (address) {
      setValue("addressLine1", address.numero ?? '');
      setValue("addressLine2", address.nomRue ?? '');
      setValue("addressLine3", address.complement ?? '');
      setValue("postalCode", address.codePostal.toString() ?? '');
      setValue("city", address.ville ?? '');
    }
    setIsLoading(false);
  }, [setValue, address]);
  
  const onSubmit = (data: any) => {
    console.log(data);
    setIsSaving(true);
  };

  const onCancel = () => {
    setIsEditable(false);
    props.handleCancel();
  }
  
  return (
    <>
      <form className="d-grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="d-grid gap-3">
          <Input
            type="text"
            name="addressLine1"
            label={Texts.user.address.inputs.address1}
            errors={errors}
            register={register}
          />
          <Input
            type="text"
            name="addressLine2"
            label={Texts.user.address.inputs.address2}
            errors={errors}
            register={register}
          />
          <Input
            type="text"
            name="addressLine3"
            label={Texts.user.address.inputs.address3}
            errors={errors}
            register={register}
          />
          <Row>
            <Col>
              <Input
                type="text"
                name="postalCode"
                label={Texts.user.address.inputs.postalCode}
                errors={errors}
                register={register}
              />
            </Col>
            <Col>
              <Input
                type="text"
                name="city"
                label={Texts.user.address.inputs.city}
                errors={errors}
                register={register}
              />
            </Col>
          </Row>
          <Button
            variant="primary"
            type="submit"
          >
           Enregistrer
          </Button>
          <Button variant="light" type="button" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </form>
    </>
  );
}
````

> IMPORTANT : le nom des champs bindés et le nom des champs Input **doit** être le même que les noms des champs du schema yup
