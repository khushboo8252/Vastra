import { Box, Button, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartData } from "../Redux/Cart/Cart.action";
import CartComponent from "./CartComponent";
import LoadingPage from "./LoadingPage";
import PageNotFound from "./PageNotFound";
import PaymentNavbar from "../Components/PaymentNavbar";
import { useNavigate } from "react-router-dom";
import { deleteCartAPI } from "../Redux/Cart/Cart.api";
import { postCheckoutData } from "../Redux/Checkout/Checkout.action";

const Cart = () => {
  const { loading, error } = useSelector((store) => store.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sampleData, setSampleData] = useState([]);

  // Fetch and initialize cart data
  const fetchCartAPI = async () => {
  try {
    const res = await axios.get(`https://vastra.onrender.com/cart`);
    if (res?.data?.length > 0) {
      const result = res.data.map((item) => ({
        ...item,
        isChecked: true, // ✅ auto-select items
        qty: 1,
      }));
      setSampleData(result);
    } else {
      setSampleData([]); // in case cart is empty
    }
  } catch (err) {
    console.error("Failed to fetch cart data:", err);
    setSampleData([]); // fallback in error
  }
};


  useEffect(() => {
    dispatch(fetchCartData());
    fetchCartAPI();
  }, [dispatch]);

  // Toggle item selection
  const handleCheckData = (id, cart) => {
    const resultData = sampleData.map((item) =>
      item._id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setSampleData(resultData);
    dispatch(postCheckoutData(cart));
  };

  // Change item quantity
  const handleChangeQty = (value, id) => {
    const resultData = sampleData.map((item) =>
      item._id === id ? { ...item, qty: value } : item
    );
    setSampleData(resultData);
  };

  // Remove item from cart
  const removeFromCart = async (id) => {
    await deleteCartAPI(id);
    fetchCartAPI();
  };

  // Calculate totals
  const checkedItems = sampleData.filter((item) => item.isChecked);
  const resultcount = checkedItems.reduce(
    (acc, item) => acc + item.discounted_price * item.qty,
    0
  );
  const resultStriked = checkedItems.reduce(
    (acc, item) => acc + item.strike_price * item.qty,
    0
  );

  const placeOrderObj = {
    "Total MRP": resultStriked || 0,
    "Discount on MRP": (resultStriked - resultcount) || 0,
    "Total Amount": resultcount || 0,
  };

  if (loading) return <LoadingPage />;
  if (error) return <PageNotFound />;

  return (
    <>
      <Box>
        <PaymentNavbar />
      </Box>

      <Box
        m="auto"
        mt={{ base: "4rem", md: "6rem" }}
        width={{ base: "90%", md: "70%" }}
      >
        <Flex
          alignItems="flex-start"
          justifyContent="space-between"
          flexDirection={{ base: "column", md: "row" }}
          gap={6}
        >
          {/* Left: Cart Items */}
          <Box width={{ base: "100%", md: "60%" }} mt={0}>
            <Box>
              <Flex justifyContent="space-between" textAlign="left">
                <Text fontWeight={600} fontSize="0.9rem" color="gray.700">
                  Check Delivery time & services
                </Text>
                <Button
                  fontSize="0.8rem"
                  borderRadius={0}
                  bg="#fff"
                  border="1px solid tomato"
                  color="tomato"
                >
                  ENTER PIN CODE
                </Button>
              </Flex>
            </Box>

            <Box mb={3}>
              <Flex fontSize="0.9rem" alignItems="center" gap="1rem">
                <Text fontWeight={600} fontSize="0.8rem" color="gray.700">
                  ({checkedItems.length}/{sampleData.length}) ITEMS SELECTED
                </Text>
              </Flex>
            </Box>

            <Box>
              {sampleData.map((cart, i) => (
                <CartComponent
                  key={i}
                  cart={cart}
                  handleCheckData={handleCheckData}
                  handleChangeQty={handleChangeQty}
                  removeFromCart={removeFromCart}
                />
              ))}
            </Box>
          </Box>

          {/* Right: Price Summary */}
          <Box
            width={{ base: "100%", md: "40%" }}
            p={3}
            boxShadow="md"
            border="0px solid gray"
          >
            <Box textAlign="left" borderBottom="1px solid gray">
              <Text>PRICE DETAILS ({checkedItems.length} item)</Text>
            </Box>

            <Box py="1rem" borderBottom="1px solid gray">
              {Object.entries(placeOrderObj).map(([label, value]) => (
                <Flex key={label} justifyContent="space-between" mb="4px">
                  <Text>{label}</Text>
                  <Text>₹ {value}</Text>
                </Flex>
              ))}
            </Box>

            <Button
              w="100%"
              mt="2rem"
              color="white"
              bg="pink.400"
              _hover={{
                bg: "white",
                color: "pink.400",
                outline: "2px solid #e10765",
              }}
              onClick={() => {
                if (checkedItems.length === 0) {
                  alert("Please select at least one item.");
                  return;
                }
                localStorage.setItem("Total MRP", resultcount);
                localStorage.setItem("DiscountPrice", resultStriked);
                navigate("/address");
              }}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Cart;
