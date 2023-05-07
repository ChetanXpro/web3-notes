import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { login, walletLogin } from "../../Api/api";

import { useAtom } from "jotai";
import { ethers } from "ethers";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
// import SocialLogin from "@biconomy/web3-auth";
// import "@biconomy/web3-auth/dist/src/style.css";
import { useToast } from "@chakra-ui/react";
import { user } from "../../atoms/status";
import { Tag } from "antd";
import useWalletAuth from "../../hooks/useWalletAuth";
const Login = () => {
  const [email, setEmail] = useState("");
  const from = location.state?.from?.pathname || "/profile";

  const navigate = useNavigate();
  // const { setAuth, setUser } = useAuth();
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const toast = useToast({ position: "top" });
  const [userData, setUserData] = useAtom(user);

  const queryClient = useQueryClient();
  const loc = useLocation();

  const { isLoading, mutate: walletMutate } = useMutation(walletLogin, {
    onSuccess: (data) => {
      const token = data?.accessToken;

      if (!data?.accessToken) {
        return toast({
          title: "Login failed",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }

      toast({
        title: "Logined Successfuly",

        status: "success",
        duration: 2000,
        isClosable: true,
      });

      localStorage.setItem("jwt", token);

      setUserData({
        email: data.email,
        name: data.name,
      });

      setSuccess(true);

      navigate(from, { replace: true });
    },
    onError: (e) => {
      toast({
        title: e.statusText,

        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      email,
      password,
    };
    mutate(payload);
  };

  const handleWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const message = "Sign this message to log in to our app";

    const currentAccount = await provider.getSigner().getAddress();

    const signature = await provider.getSigner().signMessage(message);

    const payload = {
      address: currentAccount.toLocaleLowerCase(),
      signature: signature,
      message,
    };
    walletMutate(payload);
  };

  return (
    <Flex h="100vh" w={"100vw"} bg={"#2b2b2b"} justifyContent="center">
      <Flex
        marginX="6"
        marginY={"6"}
        w={[300, 300, 400]}
        flexDirection={"column"}
        mt={"36"}
      >
        <div
          onClick={() => navigate("/")}
          className="text-md  bg-gray-500 rounded-full mb-10 flex items-center cursor-pointer  justify-center font-bold text-center uppercase"
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
        <Button
          isLoading={isLoading}
          loadingText="Connecting"
          width={"full"}
          h="12"
          colorScheme={"teal"}
          mt={"4"}
          onClick={handleWallet}
        >
          Sign in
        </Button>

        <div></div>
        <Flex mt={"4"} justifyContent="center">
          <span
            style={{ textAlign: "center", marginRight: "6px", color: "wheat" }}
          >
            Don't have an account ?{" "}
          </span>
          <Link className="text-blue-400" to={"/sign_up"}>
            Sign up
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Login;
