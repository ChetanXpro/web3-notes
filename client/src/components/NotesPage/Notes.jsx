import {
  Button,
  Divider,
  Text,
  useToast,
  Tooltip,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import React from "react";
import pdfImage from "../../assets/pdflogo.png";
import svgImage from "../../assets/svg.png";
import docImage from "../../assets/docs.png";
import { Popconfirm } from "antd";
import { useQueryClient } from "react-query";

import usePrivateApis from "../../hooks/usePrivateApis";
const Notes = ({ name, url, re, id, size }) => {
  const { deleteNote } = usePrivateApis();

  const toast = useToast({ position: "top" });
  const queryClient = useQueryClient();

  const { colorMode } = useColorMode();

  const imagesType = [
    ".png",
    ".jpeg",
    ".jpg",
    "jpeg",
    ".jpe",
    ".jif",
    "jfif",
    ".jfi",

    ".gif",
    "webp",
    "tiff",
    ".tif",
  ];
  const SVG = [".svg"];
  const DOCUMENTS = [".doc", "docx", ".txt"];
  const PDF = [".pdf"];

  const EXT = name.slice(-4).toLowerCase();
  return (
    <div
      className={`m-2 relative mt-8  flex ${
        colorMode === "dark"
          ? "hover:bg-gray-900 hover:rounded-md"
          : "hover:bg-gray-300 hover:rounded-md"
      }  md:m-4`}
    >
      <div className=" flex flex-col items-center  border rounded-md w-40">
        <div
          onClick={(e) => e.stopPropagation()}
          className="  absolute right-0 top-0  "
        >
          <Popconfirm
            placement="bottom"
            color={"blue"}
            title="You cannot recover after note after deleting"
            description={`Are you sure to delete ${name}  `}
            onConfirm={() => {
              deleteNote(id, re, name);
              queryClient.invalidateQueries("note");

              toast({
                title: `${name} Deleted`,
                status: "success",
                duration: 2000,
                isClosable: true,
              });
            }}
            // onCancel={cancel}
            okText="Delete"
            cancelText="Cancel"
          >
            <a href="#">
              <IconButton
                size={"sm"}
                colorScheme={"red"}
                icon={<DeleteIcon className="" />}
              />
            </a>
          </Popconfirm>
        </div>
        <Tooltip label={`${name}`} placement="top">
          <div className="h-[6rem] flex justify-center bg-orange-800 object-cover w-20">
            {imagesType.includes(EXT) ? (
              <img height={"100%"} width="100%" src={url} alt="img" />
            ) : SVG.includes(EXT) ? (
              <img src={svgImage} alt="svg" />
            ) : PDF.includes(EXT) ? (
              <img height={"100%"} width="100%" src={pdfImage} alt="pdf" />
            ) : DOCUMENTS.includes(EXT) ? (
              <img src={docImage} alt="doc" />
            ) : (
              ""
            )}
          </div>
        </Tooltip>
        <Divider className="mt-1 bg-slate-400 mb-0" />
        <div className="flex z-10   mb-1 justify-between text-left w-full  h-16 pl-4  flex-col">
          <div className="text-sm capitalize font-sans  text-left ">
            <Text className="truncate text-sm">{name}</Text>
          </div>
          <div className=" ">
            <a href={url} download>
              <Tooltip label={`${size}`} placement="bottom">
                <div className="button">
                  <div className="button-wrapper">
                    <div className="text">Download</div>
                    <span className="icon">
                      <svg
                        viewBox="0 0 24 24"
                        preserveAspectRatio="xMidYMid meet"
                        height="2em"
                        width="2em"
                        role="img"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"
                          strokeWidth="2"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                        ></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </Tooltip>
              {/* <Button size={"xs"}>Download</Button> */}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
