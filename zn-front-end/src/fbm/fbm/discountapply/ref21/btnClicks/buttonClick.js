/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import refresh_BtnClick from "./refresh_BtnClick";

export default function buttonClick(props, id) {
  switch (id) {
    // Refresh	刷新
    case "Refresh":
      refresh_BtnClick.call(this, props);
      break;
    default:
      break;
  }
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/