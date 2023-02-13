import React, { useEffect } from "react";
import {
  Card,
  CardBody,
  Heading,
  Image,
  Divider,
  useDisclosure,
  Text,
  InputGroup,
  NumberInput,
  NumberInputField,
  Textarea,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
} from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, IconButton } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { FormControl, FormLabel, CardFooter, CardHeader } from "@chakra-ui/react";
import { Button, Input, InputRightElement, Select } from "@chakra-ui/react";
import Axios from "axios";
import { API_URL } from "../helper";
import Header from "../components/Header";
import { Search2Icon, ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem } from "../actions/cart";
import { BiTrash } from "react-icons/bi";
import { useToast } from "@chakra-ui/react";

function Products(props) {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = React.useState([]);
  const [category, setCategory] = React.useState([]);
  const [chosenCat, setChosenCat] = React.useState(null);
  const [catTitle, setCatTitle] = React.useState("All Products");
  const [cart, setCart] = React.useState([]);
  const [sortby, setSortBy] = React.useState("");
  const [desc, setDesc] = React.useState(false);
  const [filterName, setFilterName] = React.useState("");
  const [proName, setProName] = React.useState("");
  const [proCat, setProCat] = React.useState("");
  const [proQty, setProQty] = React.useState(0);
  const [proPrice, setProPrice] = React.useState(0);
  const [proDesc, setProDesc] = React.useState("");
  const [proImg, setProImg] = React.useState(null);

  const [edit, setEdit] = React.useState("Add");
  const [editId, setEditId] = React.useState(false);
  const [editProName, setEditProName] = React.useState("");
  const [editProQty, setEditProQty] = React.useState(0);
  const [editProPrice, setEditProPrice] = React.useState(0);
  const [editProDesc, setEditProDesc] = React.useState("");
  const [editProImg, setEditProImg] = React.useState(null);

  const [newCat, setNewCat] = React.useState("");

  const { idusers } = useSelector((state) => {
    return {
      idusers: state.user.idusers,
    };
  });

  const getProductsData = async () => {
    let reqURI = ["/products/all?"];
    let reqQuery = [];
    if (chosenCat !== null) {
      reqQuery.push(`category=${chosenCat}`);
    }
    if (sortby !== "") {
      if (desc) {
        reqQuery.push(`sortby=${sortby}&order=desc`);
      } else {
        reqQuery.push(`sortby=${sortby}`);
      }
    }
    if (filterName !== "") {
      reqQuery.push(`name=${filterName}`);
    }
    console.log(reqURI + reqQuery.join("&"));
    try {
      let response = await Axios.get(API_URL + reqURI + reqQuery.join("&"));
      setProducts(response.data.rows);
    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  };

  const getCatTitle = () => {
    const catName = category.filter((val) => {
      return val.idcategories === chosenCat;
    });
    if (catName.length > 0) {
      setCatTitle(catName[0].name);
    } else {
      setCatTitle("All Products");
    }
  };

  const getCategoryData = async () => {
    try {
      let response = await Axios.get(API_URL + "/categories/all");
      setCategory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const switchCat = (id) => {
    id === chosenCat ? setChosenCat(null) : setChosenCat(id);
  };

  const onBtnAddItem = (data) => {
    // console.log(data);
    setCart([...cart, { ...data, amount: 1 }]);
    // dispatch(addCartItem(data));
  };

  const onBtnEdit = (val) => {
    const { idproducts, name, quantity, price, description } = val;
    setEdit("edit");
    setEditId(idproducts);
    setEditProName(name);
    setEditProQty(quantity);
    setEditProPrice(price);
    setEditProDesc(description);
    onOpen();
  };

  const onBtnUpdate = async () => {
    try {
      let reqData = {};
      if (editProImg !== null) {
        reqData = new FormData();
        reqData.append("name", editProName);
        reqData.append("quantity", editProQty);
        reqData.append("price", editProPrice);
        reqData.append("description", editProDesc);
        reqData.append("productImg", editProImg);
      } else {
        reqData = {
          name: editProName,
          quantity: editProQty,
          price: editProPrice,
          description: editProDesc,
        };
      }
      console.log(reqData);
      let response = await Axios.patch(API_URL + `/products/${editId}`, reqData);
      if (response.data.success) {
        getProductsData();
        displayToast(true, response.data.message);
        onBtnClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onBtnCancel = () => {
    setCart([]);
  };

  const onBtnAddQty = (id, idx) => {
    const editCartItem = cart.find((val) => {
      return val.idproducts === id;
    });
    if (editCartItem.quantity > editCartItem.amount) {
      editCartItem.amount += 1;
    }
    console.log(editCartItem.amount);
    let items = [...cart];
    let item = { ...items[idx], amount: editCartItem.amount };
    items[idx] = item;
    setCart(items);
  };
  const onBtnSubQty = (id, idx) => {
    const editCartItem = cart.find((val) => {
      return val.idproducts === id;
    });
    if (editCartItem.amount !== 1) {
      editCartItem.amount -= 1;
    }
    console.log(editCartItem.amount);
    let items = [...cart];
    let item = { ...items[idx], amount: editCartItem.amount };
    items[idx] = item;
    setCart(items);
  };
  const onBtnRemoveItem = (idx) => {
    let items = [...cart];
    items.splice(idx, 1);
    setCart(items);
  };

  const onBtnCheckout = async () => {
    try {
      let response = await Axios.post(API_URL + "/transactions", {
        idusers,
        cart,
      });
      if (response.data.success) {
        setCart([]);
        displayToast(true, response.data.message);
      }
    } catch (error) {
      console.log(error);
      displayToast(false, error.response.data.message);
    }
  };

  const onBtnRegis = async () => {
    try {
      const formData = new FormData();
      formData.append("name", proName);
      formData.append("idcategories", parseInt(proCat));
      formData.append("quantity", proQty);
      formData.append("price", proPrice);
      formData.append("description", proDesc);
      formData.append("productImg", proImg);
      console.log(formData);
      let response = await Axios.post(API_URL + "/products/regis", formData);
      if (response.data.success) {
        getProductsData();
        clearInput();
        onBtnClose();
        displayToast(true, response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onBtnAddCat = async () => {
    setEdit("category");
    onOpen();
  };

  const onBtnAddNewCat = async () => {
    try {
      let response = await Axios.post(API_URL + "/categories/regis", {
        name: newCat.toLowerCase(),
      });
      if (response.data.success) {
        getCategoryData();
        displayToast(true, response.data.message);
        onBtnClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearInput = () => {
    setProName("");
    setProCat("");
    setProQty(0);
    setProPrice(0);
    setProDesc("");
    setProImg(null);

    setEditProName("");
    setEditProQty(0);
    setEditProPrice(0);
    setEditProDesc("");
    setEditProImg(null);

    setNewCat("");
  };

  const onBtnClose = () => {
    setEdit("Add");
    clearInput();
    onClose();
  };

  const displayToast = (success, message = "Oops Something Went Wrong") => {
    return success
      ? toast({
          title: message,
          status: "success",
          isClosable: true,
          duration: 5000,
          position: "top",
        })
      : toast({
          title: message,
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
  };

  const renderCategory = () => {
    return category.map((val, idx) => {
      return (
        <Button
          onClick={() => switchCat(val.idcategories)}
          key={idx}
          size="lg"
          height={20}
          width="120px"
          colorScheme="red"
          variant="outline"
          value={chosenCat}
          isActive={val.idcategories === chosenCat}
        >
          <Heading size="md" textTransform="capitalize">
            {val.name}
          </Heading>
        </Button>
      );
    });
  };

  const renderProduct = () => {
    if (products.length === 0) {
      return <Text fontSize="lg">DATA NOT FOUND</Text>;
    }
    return products.map((val, idx) => {
      const { name, productImg, price } = val;
      return (
        <WrapItem key={idx}>
          <Card
            maxW="xs"
            minW="3xs"
            key={val.idproducts}
            borderRadius="md"
            align="center"
            shadow="lg"
          >
            <CardBody>
              <div className="d-flex flex-column justify-content-between h-100 gap-2">
                <div className="d-flex flex-column gap-2">
                  <button onClick={() => onBtnEdit(val)}>
                    <Image borderRadius="lg" src={API_URL + productImg} alt={name} />
                  </button>
                  <Heading size="sm" textTransform="capitalize" color="gray.700">
                    {name}
                  </Heading>
                </div>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-end">
                    <Text fontSize="2xl" color="#008D96">
                      Rp. {parseFloat(price).toLocaleString("id")}
                    </Text>
                  </div>
                  <button
                    type="button"
                    className="btn"
                    style={{ backgroundColor: "#C0262D", color: "#F5F6F7" }}
                    onClick={() => onBtnAddItem(val)}
                    disabled={cart.some((element) => element.idproducts === val.idproducts)}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </WrapItem>
      );
    });
  };

  const renderCart = () => {
    let total = 0;
    return (
      <Card variant="outline" shadow="sm">
        <CardHeader>
          <Heading size="lg">New Transaction</Heading>
        </CardHeader>
        <CardBody>
          <TableContainer whiteSpace="nowrap">
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th pl={0}>Item</Th>
                  <Th textAlign="center">Amount</Th>
                  <Th isNumeric>Price</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cart.map((val, idx) => {
                  total += val.amount * val.price;
                  const { idproducts, name, productImg, price, amount, quantity } = val;
                  return (
                    <Tr key={idx}>
                      <Td p={0}>
                        <IconButton onClick={onBtnRemoveItem} variant="link" icon={<BiTrash />} />
                      </Td>
                      <Td pl={0} textTransform="capitalize">
                        <div className="d-flex flex-row gap-2 text-wrap align-items-center justify-content-start">
                          <Image
                            boxSize="60px"
                            borderRadius="md"
                            src={API_URL + productImg}
                            alt={name}
                          />
                          {name}
                        </div>
                      </Td>
                      <Td>
                        <div className="d-flex flex-row align-items-center justify-content-center gap-3">
                          <IconButton
                            size="xs"
                            variant="ghost"
                            colorScheme="red"
                            icon={<MinusIcon />}
                            isDisabled={amount === 1}
                            onClick={() => onBtnSubQty(idproducts, idx)}
                          />
                          <Text fontSize="xl">{amount}</Text>
                          <IconButton
                            size="xs"
                            variant="ghost"
                            colorScheme="red"
                            icon={<AddIcon />}
                            isDisabled={amount === quantity}
                            onClick={() => onBtnAddQty(idproducts, idx)}
                          />
                        </div>
                      </Td>
                      <Td isNumeric>
                        <div className="d-flex justify-content-center">
                          Rp. {parseFloat(price).toLocaleString("id")}
                        </div>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
        <CardFooter justifyContent="end" pt="0">
          <div className="d-flex flex-column gap-3">
            <div>
              <Text color="#008D96" fontSize="3xl">
                TOTAL: Rp. {total.toLocaleString("id")}
              </Text>
            </div>
            <div className="d-flex flex-row justify-content-end gap-4">
              <Button onClick={onBtnCheckout} colorScheme="red">
                Checkout
              </Button>
              <Button onClick={onBtnCancel}>Cancel</Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  };

  const renderModalContent = () => {
    if (edit === "edit") {
      return (
        <ModalContent>
          <ModalHeader>Edit Product</ModalHeader>
          <ModalCloseButton onClick={onBtnClose} />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Product Name</FormLabel>
              <Input
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                type="text"
                ref={initialRef}
                value={editProName}
                onChange={(e) => setEditProName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Quantity</FormLabel>
              <NumberInput value={editProQty} focusBorderColor="#E96F16" rounded={6} shadow="sm">
                <NumberInputField onChange={(e) => setEditProQty(e.target.value)} />
              </NumberInput>
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Price</FormLabel>
              <NumberInput value={editProPrice} focusBorderColor="#E96F16" rounded={6} shadow="sm">
                <NumberInputField onChange={(e) => setEditProPrice(e.target.value)} />
              </NumberInput>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={editProDesc}
                onChange={(e) => setEditProDesc(e.target.value)}
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                resize="none"
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Image</FormLabel>
              <input
                onChange={(e) => setEditProImg(e.target.files[0])}
                type="file"
                className="form-control shadow-sm"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onBtnUpdate} colorScheme="red" mr={3}>
              Update Product
            </Button>
            <Button onClick={onBtnClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      );
    } else if (edit === "category") {
      return (
        <ModalContent>
          <ModalHeader>Add New Category</ModalHeader>
          <ModalCloseButton onClick={onBtnClose} />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Category Name</FormLabel>
              <Input
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                type="text"
                ref={initialRef}
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onBtnAddNewCat} colorScheme="red" mr={3}>
              Add Category
            </Button>
            <Button onClick={onBtnClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      );
    } else {
      return (
        <ModalContent>
          <ModalHeader>Add New Product</ModalHeader>
          <ModalCloseButton onClick={onBtnClose} />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Product Name</FormLabel>
              <Input
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                type="text"
                ref={initialRef}
                value={proName}
                onChange={(e) => setProName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Category</FormLabel>
              <Select
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                placeholder="Select category"
                onChange={(e) => setProCat(e.target.value)}
              >
                {category.map((val, idx) => {
                  return (
                    <option value={val.idcategories} key={idx}>
                      {val.name}
                    </option>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Quantity</FormLabel>
              <NumberInput value={proQty} focusBorderColor="#E96F16" rounded={6} shadow="sm">
                <NumberInputField onChange={(e) => setProQty(e.target.value)} />
              </NumberInput>
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Price</FormLabel>
              <NumberInput value={proPrice} focusBorderColor="#E96F16" rounded={6} shadow="sm">
                <NumberInputField onChange={(e) => setProPrice(e.target.value)} />
              </NumberInput>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={proDesc}
                onChange={(e) => setProDesc(e.target.value)}
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                resize="none"
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Image</FormLabel>
              <input
                onChange={(e) => setProImg(e.target.files[0])}
                type="file"
                className="form-control shadow-sm"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onBtnRegis} colorScheme="red" mr={3}>
              Add Product
            </Button>
            <Button onClick={onBtnClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      );
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  useEffect(() => {
    getProductsData();
    getCatTitle();
  }, [chosenCat, desc]);

  const initialRef = React.useRef(null);

  return (
    <div className="container-fluid mx-3 mt-3">
      <Header open={onOpen} pageName="Product" />
      <div className="d-flex flex-row gap-4">
        {renderCategory()}
        <IconButton
          size="lg"
          height={20}
          width="120px"
          colorScheme="red"
          variant="outline"
          icon={<AddIcon />}
          onClick={onBtnAddCat}
        ></IconButton>
      </div>
      <div className="d-flex flex-row gap-3">
        <div className="d-flex flex-column w-100">
          <div className="d-flex flex-row align-items-center justify-content-between">
            <h1 className="h3 mb-3 mt-4" style={{ textTransform: "capitalize" }}>
              {catTitle}
            </h1>
            <InputGroup w="25%">
              <Input
                placeholder="Search by name..."
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                type="text"
                onChange={(e) => setFilterName(e.target.value)}
                onKeyUp={getProductsData}
              />
              <InputRightElement children={<Search2Icon color="gray.700" />} />
            </InputGroup>
            <div className="d-flex flex-row gap-3">
              Sort By:
              <Button
                rightIcon={desc ? <ChevronUpIcon /> : <ChevronDownIcon />}
                colorScheme="red"
                variant="link"
                onClick={() => {
                  setDesc(!desc);
                  setSortBy("name");
                }}
              >
                Name
              </Button>
              <Button
                rightIcon={desc ? <ChevronUpIcon /> : <ChevronDownIcon />}
                colorScheme="red"
                variant="link"
                onClick={() => {
                  setDesc(!desc);
                  setSortBy("price");
                }}
              >
                Price
              </Button>
            </div>
          </div>
          <Divider />
          <div className="d-flex flex-row mt-3 gap-4">
            <Wrap spacing="25px">{renderProduct()}</Wrap>
          </div>
        </div>
        <div className={cart.length > 0 ? "w-50" : "d-none"}>
          {cart.length > 0 ? renderCart() : null}
        </div>
      </div>

      <Modal
        closeOnOverlayClick={false}
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        {renderModalContent()}
      </Modal>
    </div>
  );
}

export default Products;
