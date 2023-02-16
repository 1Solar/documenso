import { ResizableBox, ResizeCallbackData } from "react-resizable";
import React, { SyntheticEvent, useEffect, useState } from "react";
import Draggable from "react-draggable";
import { CircleStackIcon, TrashIcon } from "@heroicons/react/24/solid";
import Logo from "../logo";
import { IconButton } from "@documenso/ui";
import toast from "react-hot-toast";
import { XCircleIcon } from "@heroicons/react/20/solid";
const stc = require("string-to-color");

type FieldPropsType = {
  field: {
    color: string;
    type: string;
    position: any;
    positionX: number;
    positionY: number;
    id: string;
    Recipient: { name: ""; email: "" };
  };
  onClick: any;
};

export default function ReadOnlyField(props: FieldPropsType) {
  const [field, setField]: any = useState(props.field);
  const [position, setPosition]: any = useState({
    x: props.field.positionX,
    y: props.field.positionY,
  });
  const nodeRef = React.createRef<HTMLDivElement>();

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      position={position}
      defaultPosition={{ x: 0, y: 0 }}
      cancel="div"
    >
      <div
        onClick={() => {
          props.onClick(props.field);
        }}
        ref={nodeRef}
        className="cursor-pointer opacity-80 p-2 m-auto w-auto flex-row-reverse text-lg font-bold text-center absolute top-0 left-0 select-none hover:brightness-50"
        style={{
          background: stc(props.field.Recipient.email),
        }}
      >
        <div className="m-auto w-auto flex-row-reverse font-medium text-center px-12 py-2">
          {field.type === "SIGNATURE" ? "SIGN HERE" : ""}
        </div>
      </div>
    </Draggable>
  );
}
