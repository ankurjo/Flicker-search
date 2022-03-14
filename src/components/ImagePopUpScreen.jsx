import React,{ useState } from "react";
import { getImageUrl } from "../utils.js";

function ImagePopUpNew({ image, onHide }) {
  const [showMeta, setShowMeta] = useState(false);

  const onImageClick = (evt) => {
    evt.stopPropagation();
    setShowMeta(!showMeta);
  };
 
  return (
    <>
      <div className="image-popup-container" onClick={onHide}>
        <img
          className="popup-image"
          src={getImageUrl(image.farm, image.server, image.id, image.secret)}
          alt=""
          style={{ marginTop: "140px" }}
          onClick={onImageClick}
        />
        {showMeta && (
          <ul className="image-metadata">
            <li style={{ margin: "5px 0" }}>Title: {image.title}</li>
            <li style={{ margin: "5px 0" }}>ImageId: {image.id}</li>
            <li style={{ margin: "5px 0" }}>FarmId: {image.farm}</li>
            <li style={{ margin: "5px 0" }}>ServerId: {image.server}</li>
            <li style={{ margin: "5px 0" }}>SecretId: {image.secret}</li>
          </ul>
        )}
      </div>
    </>
  );
}

export default ImagePopUpNew;
