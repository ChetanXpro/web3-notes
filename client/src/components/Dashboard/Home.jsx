import { Button, Spinner, Text, useColorMode } from "@chakra-ui/react";
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
// import { getUser } from "../Api/api";
import img from "../../assets/boon.png";
import MainPageHeader from "./MainPageHeader";
import { Tag } from "antd";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className=" flex flex-col bg-[#2b2b2b] text-white  justify-center    h-screen w-full items-center gap-3 ">
      <MainPageHeader />
      <div className="flex justify-between pr-24 pl-24 items-center w-full fixed top-10  h-20">
        <div
          onClick={() => navigate("/")}
          className="text-md text-black  bg-gray-100 rounded-full  w-48 flex items-center cursor-pointer  justify-center font-bold text-center uppercase"
        >
          <h1>
            Web3 <span className="block text-2xl">Notes</span>
          </h1>
          <Tag
            size={"sm"}
            className="ml-1 mb-6"
            variant="solid"
            colorScheme="teal"
          >
            beta
          </Tag>
        </div>
        <div>
          <a href="https://github.com/ChetanXpro/web3-notes-app">
            <button className="font-bold text-lg underline">Github</button>
          </a>
        </div>
      </div>
      <div className=" flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row  h-full w-full items-center gap-3">
        <div className=" flex flex-col items-center justify-center  flex-1">
          <Text className="text-4xl md:text-4xl lg:text-6xl mb-8   font-sans text-center flex-1">
            Store Your Notes
          </Text>
          <Text className="font-sans text-lg text-center ">
            Take control of your notes and store them securely
          </Text>
          <Text className="mb-5 font-sans  text-lg ">
            on a decentralized network that's always online.
          </Text>

          {/* <Button onClick={() => navigate("/upload")}>Get Started</Button> */}
          <button
            onClick={() => navigate("/sign_in")}
            className="cssbuttons-io-button"
          >
            Get started
            <div className="iconn">
              <svg
                height="24"
                width="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </button>
        </div>
        <div className=" items-center justify-end  flex-1 ">
          <div className="mt-8 ">
            <img
              className="rounded-[30%]"
              height={"400px"}
              width="400px"
              src={img}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
