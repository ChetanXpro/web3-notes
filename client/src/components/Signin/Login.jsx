import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { login, walletLogin } from "../../Api/api";
import { useAtom } from "jotai";
import { ethers } from "ethers";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
// import { Backdrop, Modal } from "@mui/material";
import jwtDecode from "jwt-decode";
import { useToast } from "@chakra-ui/react";
import { user } from "../../atoms/status";
const Login = () => {
  const [email, setEmail] = useState("");
  const from = location.state?.from?.pathname || "/";

  const navigate = useNavigate();
  // const { setAuth, setUser } = useAuth();
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const toast = useToast({ position: "top" });
  const [userData, setUserData] = useAtom(user);

  const queryClient = useQueryClient();
  const loc = useLocation();
  const { isLoading, isError, error, mutate } = useMutation(login, {
    onSuccess: (data) => {
      toast({
        title: "Logined Successfuly",

        status: "success",
        duration: 2000,
        isClosable: true,
      });
      const token = data?.accessToken;
      localStorage.setItem("jwt", token);

      setUserData({
        email: data.email,
        name: data.name,
      });

      setSuccess(true);

      navigate(from, { replace: true });
    },
  });

  const { isLoadings, mutate: walletMutate } = useMutation(walletLogin, {
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
    if (typeof window.ethereum !== "undefined") {
      //  console.log(window.ethereum);
      //  const web3 = new ethers.providers.Web3Provider(window.ethereum)

      //   const message = "Sign this message to log in to our app"

      //   const adrr = await web3.getSigner().getAddress();
      //   const  signature = await web3.getSigner().signMessage(message)

      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Get the current account address
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const currentAccount = accounts[0];

      const message = "Sign this message to log in to our app";

      // Sign the message using the user's connected wallet
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, currentAccount],
      });

      const payload = {
        address: currentAccount,
        signature,
        message,
      };
      walletMutate(payload);
    } else {
      alert("MetaMask not installed");
    }
  };
  return (
    <Flex h="100vh" bg={"#2b2b2b"} justifyContent="center">
      <Flex
        marginX="6"
        marginY={"6"}
        w={[300, 300, 400]}
        flexDirection={"column"}
        mt={"36"}
      >
        <form onSubmit={handleSubmit}>
          <Text
            textAlign={"center"}
            color="white"
            fontFamily={"heading"}
            fontSize="2xl"
            mb={"6"}
          >
            Login to your account
          </Text>
          <p
            style={{
              textAlign: "center",
              marginBottom: "12px",
              marginTop: "4px",
              color: "red",
            }}
          >
            {isError ? `${error?.data?.message}` : ""}
          </p>
          <FormControl mb={"4"} isInvalid={false}>
            <Input
              type={"email"}
              h="12"
              color={"whiteAlpha.900"}
              autoComplete="true"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormControl>
          <FormControl mb={"4"} isInvalid={false}>
            <Input
              type={"password"}
              h="12"
              color={"whiteAlpha.900"}
              autoComplete="true"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </FormControl>

          <Button
            isLoading={isLoading}
            loadingText="Checking..."
            width={"full"}
            h="12"
            colorScheme={`${success ? "green" : "teal"}`}
            mt={"2"}
            onClick={handleSubmit}
          >
            {success ? "Logined Successfuly" : "Login"}
          </Button>
          <Text className="w-full text-center my-3">Or</Text>
          <Button
            isLoading={isLoading}
            loadingText="Checking..."
            width={"full"}
            h="12"
            colorScheme={`${success ? "green" : "teal"}`}
            mt={"2"}
            onClick={handleWallet}
          >
            {success ? "Logined Successfuly" : "Login with wallet"}
          </Button>
        </form>
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
