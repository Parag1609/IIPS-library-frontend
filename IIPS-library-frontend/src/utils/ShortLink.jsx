import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const ShortLink = ({ url, maxLength = 15 }) => {
  const displayText =
    url.length > maxLength ? url.substring(0, maxLength) + "..." : url;

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id={`tooltip-${url}`}>{url}</Tooltip>}
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        {displayText}
      </a>
    </OverlayTrigger>
  );
};

export default ShortLink;
