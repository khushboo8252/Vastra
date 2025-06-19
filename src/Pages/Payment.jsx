import {
  Box,
  Flex,
  FormLabel,
  HStack,
  Stack,
  Text,
  Image,
  Heading,
  Input,
  Button,
  FormControl,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentNavbar from "../Components/PaymentNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartData, fetchCartData } from "../Redux/Cart/Cart.action";
import {
  deleteCheckoutData,
  getCheckoutData,
} from "../Redux/Checkout/Checkout.action";

function Payment() {
  const [toggle, setToggle] = useState(true);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const [value, setValue] = useState({
    cardno: "",
    cardName: "",
    month: "",
    cvv: "",
  });

  const { cartData } = useSelector((store) => store.cart);
  const { checkoutData } = useSelector((store) => store.checkout);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartData());
    dispatch(getCheckoutData());
  }, []);

  // ✅ Dynamically calculated totals
  const TotalMRP = cartData.reduce(
    (acc, item) => acc + Number(item.strike_price || 0),
    0
  );
  const DiscountPrice = cartData.reduce(
    (acc, item) => acc + Number(item.discounted_price || 0),
    0
  );

  const captcha = 3535;
  const { cardno, cardName, month, cvv } = value;

  const activeStyle = {
    fontSize: "14px",
    fontWeight: "700",
    borderLeft: "5px solid #ff3f6c",
    cursor: "pointer",
    color: "#ff3f6c",
    backgroundColor: "#fff",
  };

  const defaultStyle = {
    backgroundColor: "lightgray",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  };

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const handleSubmit = () => {
    for (let i = 0; i < cartData.length; i++) {
      for (let j = 0; j < checkoutData.length; j++) {
        if (cartData[i].id === checkoutData[j].id) {
          dispatch(deleteCartData(cartData[i].id)).then(() =>
            dispatch(fetchCartData())
          );
          dispatch(deleteCheckoutData(checkoutData[j].id)).then(() =>
            dispatch(getCheckoutData())
          );
        }
      }
    }

    if (code !== captcha || code === "") {
      toast.error("Please fill the captcha correctly", {
        position: "top-center",
      });
      return;
    }

    navigate("/success");
  };

  const handleSubmitCard = () => {
    for (let i = 0; i < cartData.length; i++) {
      for (let j = 0; j < checkoutData.length; j++) {
        if (cartData[i].id === checkoutData[j].id) {
          dispatch(deleteCartData(cartData[i].id)).then(() =>
            dispatch(fetchCartData())
          );
          dispatch(deleteCheckoutData(checkoutData[j].id)).then(() =>
            dispatch(getCheckoutData())
          );
        }
      }
    }

    if (!cardName || !cardno || !month || !cvv) {
      toast.error("Please fill all card details", {
        position: "top-center",
      });
      return;
    }

    navigate("/success");
  };

  return (
    <>
      <PaymentNavbar />
      <Flex minH={"100vh"} align={"center"} justify={"center"}>
        <HStack
          mt={9}
          spacing={8}
          py={12}
          px={6}
          w={["full", "full", "70%"]}
          alignItems={"flex-start"}
          display={["grid", "grid", "flex"]}
        >
          {/* Left side - Payment methods */}
          <Box borderRight={"1px solid lightgray"} p={6}>
            <Stack>
              <Box border={"1px solid lightgray"} p={2}>
                <HStack>
                  <Image
                    src="https://w7.pngwing.com/pngs/679/616/png-transparent-sales-discounts-and-allowances-computer-icons-dicount-miscellaneous-angle-text.png"
                    w="30px"
                  />
                  <Text fontWeight={700} fontSize="14px">
                    Bank Offer
                  </Text>
                </HStack>
                <Text fontSize={"13px"} paddingLeft="40px" color="gray">
                  • 10% Instant Discount on Credit and Debit Card on a min Spend
                  of Rs 3,000. TCA
                </Text>
                <Text paddingLeft="40px" fontWeight={700} color="#ff3f6c">
                  Show More
                </Text>
              </Box>

              <Box>
                <Heading fontSize="16px" p={"10px 0"}>
                  Choose Payment Mode
                </Heading>
                <HStack border={"1px solid lightgray"} justifyContent={"space-between"} p={5}>
                  {/* Payment mode sidebar */}
                  <Box w="40%">
                    <Box onClick={handleToggle} style={toggle ? activeStyle : defaultStyle} p={2}>
                      Cash On Delivery
                    </Box>
                    <Box onClick={handleToggle} style={!toggle ? activeStyle : defaultStyle} p={2} mt={2}>
                      Credit/Debit Card
                    </Box>
                    <Box style={defaultStyle} p={2} mt={2}>PhonePe/Google</Box>
                    <Box style={defaultStyle} p={2} mt={2}>Paytm/Wallets</Box>
                    <Box style={defaultStyle} p={2} mt={2}>Net Banking</Box>
                    <Box style={defaultStyle} p={2} mt={2}>EMI/Pay Later</Box>
                  </Box>

                  {/* Payment content */}
                  {toggle ? (
                    <Box pl={4}>
                      <Stack spacing={4} textAlign="left">
                        <Text fontWeight={700}>Pay On Delivery (Cash/UPI)</Text>
                        <Box w={"30%"} textAlign="center" p={2} border={"1px solid"} borderRadius="5px">
                          {captcha}
                        </Box>
                        <Input
                          w="60%"
                          type={"text"}
                          placeholder="Enter the above code"
                          value={code}
                          onChange={(e) => setCode(Number(e.target.value))}
                        />
                        <Text fontSize={"12px"} color={"gray"}>
                          You can pay via Cash or UPI at time of delivery.
                        </Text>
                        <Button
                          background={"#ff3f6c"}
                          color="#fff"
                          _hover={{ backgroundColor: "#fff36c", color: "#000" }}
                          onClick={handleSubmit}
                        >
                          Place Order
                        </Button>
                      </Stack>
                    </Box>
                  ) : (
                    <Box textAlign={"left"} pl={4}>
                      <FormControl>
                        <Text m={"10px 0px"} fontSize="14px" fontWeight={"700"}>
                          CREDIT/DEBIT CARD
                        </Text>
                        <Text fontSize={"14px"} color="darkgray">
                          Ensure your card supports online transactions.{" "}
                          <Text color="#ff3f6c" display={"inline"}>Know More</Text>
                        </Text>
                        <Stack mt={4} spacing={6}>
                          <Input
                            fontSize={"13px"}
                            type="number"
                            placeholder="Card Number"
                            onChange={(e) =>
                              setValue((prev) => ({ ...prev, cardno: e.target.value }))
                            }
                          />
                          <Input
                            fontSize={"13px"}
                            type="text"
                            placeholder="Name on Card"
                            onChange={(e) =>
                              setValue((prev) => ({ ...prev, cardName: e.target.value }))
                            }
                          />
                          <HStack>
                            <Input
                              fontSize={"13px"}
                              type="month"
                              onChange={(e) =>
                                setValue((prev) => ({ ...prev, month: e.target.value }))
                              }
                            />
                            <Input
                              fontSize={"13px"}
                              type="number"
                              placeholder="CVV"
                              onChange={(e) =>
                                setValue((prev) => ({ ...prev, cvv: e.target.value }))
                              }
                            />
                          </HStack>
                          <Button
                            background={"#ff3f6c"}
                            color="#fff"
                            _hover={{ backgroundColor: "#fff36c", color: "#000" }}
                            onClick={handleSubmitCard}
                          >
                            Pay Now
                          </Button>
                        </Stack>
                      </FormControl>
                    </Box>
                  )}
                </HStack>
              </Box>
            </Stack>
          </Box>

          {/* Right side - Order Summary */}
          <Box w={["full", "full", "45%"]}>
            <Stack p={4}>
              <FormLabel fontSize={"12px"}>PRICE DETAILS ({cartData.length} items)</FormLabel>

              <HStack justifyContent={"space-between"}>
                <Text fontSize={"14px"}>Total MRP</Text>
                <Text>₹ {TotalMRP}</Text>
              </HStack>

              <HStack justifyContent={"space-between"}>
                <Text fontSize={"14px"}>Discount on MRP</Text>
                <Text color={"green"}>₹ {TotalMRP - DiscountPrice}</Text>
              </HStack>

              <HStack justifyContent={"space-between"}>
                <Text fontSize={"14px"}>Convenience Fee</Text>
                <HStack>
                  <Text textDecoration={"line-through"}>₹99</Text>
                  <Text color={"green"} fontSize={"13px"} fontWeight={"500"}>
                    FREE
                  </Text>
                </HStack>
              </HStack>

              <hr />

              <HStack justifyContent={"space-between"}>
                <Text fontSize={"14px"} fontWeight={"500"}>Total Amount</Text>
                <Text fontSize={"14px"} fontWeight={"500"}>₹ {DiscountPrice}</Text>
              </HStack>
            </Stack>
          </Box>
        </HStack>
        <ToastContainer />
      </Flex>
    </>
  );
}

export default Payment;
