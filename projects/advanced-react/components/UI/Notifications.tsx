import { NotificationStatus } from "../../store/ui-slice";
import "./Notification.css";

export const Notification = (props) => {
  let specialClasses = "";

  if (props.status === NotificationStatus.error) {
    specialClasses = "error";
  }
  if (props.status === NotificationStatus.success) {
    specialClasses = "success";
  }

  const cssClasses = `notification ${specialClasses}`;

  return (
    <section className={cssClasses}>
      <h2>{props.title}</h2>
      <p>{props.message}</p>
    </section>
  );
};
