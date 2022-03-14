import React from "react";
import { getImageUrl } from "../utils.js";

function NewImageList({ imageList,onImageClickProps }) {

  const renderImageItem=(image, idx, onClick)=> {
    const { farm, server, id, secret } = image;

    return (
        <li key={idx} className="image-item" onClick={() => onClick(idx)}>
            <img src={getImageUrl(farm, server, id, secret)} alt="" width="300px" />
        </li>
    );
}

const onImageClick=(idx)=> {
    onImageClickProps(idx);
}
  return (
    <>
       <ul className="h-flex sb">
				{imageList.map((image, idx) => renderImageItem(image, idx, onImageClick))}
			</ul>
    </>
  );
}

export default NewImageList;
