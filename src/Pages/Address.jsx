import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Image,
  Button,
  Text,
  HStack,
  Heading,
  ButtonGroup,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import PaymentNavbar from '../Components/PaymentNavbar';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { fetchCartData } from "../Redux/Cart/Cart.action";

export default function Address() {
  const [toggle, setToggle] = useState(true);
  const [value, setValue] = useState({
    name: "",
    mobileno: "",
    pinCode: "",
    address: "",
    town: "",
    city: "",
    state: "",
  });

  const dispatch = useDispatch();
  const { cartData } = useSelector((store) => store.cart);

  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  const { name, mobileno, pinCode, address, town, city, state } = value;

  const handleSubmit = () => {
    if (!name || !mobileno || !pinCode || !address || !town || !city || !state) {
      toast.error(`Please fill all the fields`, {
        position: "top-center",
      });
      return;
    }
    setToggle(false);
  };

  const handleToggle = () => {
    setToggle(true);
  };

  // ✅ Calculate price details from Redux cart data
  const TotalMRP = cartData.reduce(
    (acc, item) => acc + Number(item.strike_price || 0),
    0
  );
  const DiscountPrice = cartData.reduce(
    (acc, item) => acc + Number(item.discounted_price || 0),
    0
  );

  return (
    <Box>
      <PaymentNavbar />
      <Flex minH={'100vh'} align={'center'} justify={'center'}>
        <HStack
          mt={9}
          zIndex="9"
          spacing={[0, 0, 8]}
          mx={'auto'}
          py={12}
          px={6}
          display={["grid", "grid", "flex"]}
          w={["full", "full", "70%"]}
          alignItems={"flex-start"}
        >
          {toggle ? (
            <Box padding={8} borderRight={"1px solid lightgray"}>
              <Box border={"1px solid lightgray"} p={6} mb={4}>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel fontSize={"11px"}>CONTACT DETAILS</FormLabel>
                    <Input
                      type="text"
                      placeholder="Name*"
                      fontSize={"13px"}
                      mb={4}
                      onChange={(e) =>
                        setValue((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Mobile No*"
                      fontSize={"13px"}
                      mb={4}
                      onChange={(e) =>
                        setValue((prev) => ({ ...prev, mobileno: e.target.value }))
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize={"11px"}>ADDRESS</FormLabel>
                    <Input
                      type="number"
                      placeholder="Pin Code*"
                      fontSize={"13px"}
                      mb={4}
                      onChange={(e) =>
                        setValue((prev) => ({ ...prev, pinCode: e.target.value }))
                      }
                    />
                    <Input
                      type="text"
                      placeholder="Address*"
                      fontSize={"13px"}
                      mb={4}
                      onChange={(e) =>
                        setValue((prev) => ({ ...prev, address: e.target.value }))
                      }
                    />
                    <Input
                      type="text"
                      placeholder="Locality / Town*"
                      fontSize={"13px"}
                      mb={4}
                      onChange={(e) =>
                        setValue((prev) => ({ ...prev, town: e.target.value }))
                      }
                    />
                    <HStack justifyContent={"space-between"}>
                      <Input
                        type="text"
                        placeholder="City/District*"
                        fontSize={"13px"}
                        mb={4}
                        onChange={(e) =>
                          setValue((prev) => ({ ...prev, city: e.target.value }))
                        }
                      />
                      <Input
                        type="text"
                        placeholder="State*"
                        fontSize={"13px"}
                        mb={4}
                        onChange={(e) =>
                          setValue((prev) => ({ ...prev, state: e.target.value }))
                        }
                      />
                    </HStack>
                  </FormControl>
                  <Checkbox>Make this my default address</Checkbox>
                  <Button
                    fontSize={"14px"}
                    bg={'#ff3f6c'}
                    color={'white'}
                    onClick={handleSubmit}
                    _hover={{ bg: '#ff3f6c' }}
                  >
                    ADD ADDRESS
                  </Button>
                </Stack>
              </Box>
            </Box>
          ) : (
            <Box p={6} w={"full"} textAlign={"left"}>
              <HStack justifyContent={"space-between"}>
                <Heading fontSize={"18px"}>Select Delivery Address</Heading>
                <Text
                  fontSize={"11px"}
                  fontWeight={"500"}
                  p={1}
                  borderRadius={"4px"}
                  border={"1px solid black"}
                  color={"gray"}
                >
                  ADD NEW ADDRESS
                </Text>
              </HStack>

              <Stack mt={6} fontSize={"12px"} boxShadow="md" p={4} borderRadius="4px">
                <HStack>
                  <Text fontSize={"14px"} fontWeight="700">
                    {value.name}
                  </Text>
                  <Box fontSize={"10px"} color="green" border={"1px solid green"} borderRadius="8px" px={2}>
                    HOME
                  </Box>
                </HStack>
                <Text color={"gray"}>
                  {value.address}, {value.town}
                </Text>
                <Text color={"gray"}>
                  {value.city}, {value.state} - {value.pinCode}
                </Text>
                <Text color={"gray"}>
                  Mobile: <b>{value.mobileno}</b>
                </Text>
                <Text>• Pay on Delivery available</Text>
                <Button fontSize={"12px"} bg="#fff" border={"1px solid"} onClick={handleToggle}>
                  REMOVE
                </Button>
              </Stack>

              <Flex mt={6} flexWrap="wrap">
                {/* Payment option logos */}
                {[
                  "ssl", "visa", "mc", "ae", "dc", "nb", "cod", "rupay", "paypal", "bhim"
                ].map((img, i) => (
                  <Image
                    key={i}
                    w="70px"
                    src={`https://constant.myntassets.com/checkout/assets/img/footer-bank-${img}.png`}
                    alt="card"
                    mr={2}
                  />
                ))}
              </Flex>
            </Box>
          )}

          {/* Price Details */}
          <Box w={["full", "full", "45%"]} mt={[8, 8, 0]}>
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
                <Text fontSize={"14px"} fontWeight={"500"}>
                  Total Amount
                </Text>
                <Text fontSize={"14px"} fontWeight={"500"}>
                  ₹ {DiscountPrice}
                </Text>
              </HStack>

              {!toggle && (
                <Link to="/payment">
                  <Button
                    bg={"#ff3f6c"}
                    color={"#fff"}
                    w="full"
                    _hover={{ bg: "#ff3f6c" }}
                  >
                    Checkout
                  </Button>
                </Link>
              )}
            </Stack>
          </Box>
        </HStack>
      </Flex>
      <ToastContainer />
    </Box>
  );
}
