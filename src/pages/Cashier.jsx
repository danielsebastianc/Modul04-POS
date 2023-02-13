import React, { useEffect } from "react";
import Axios from "axios";
import Header from "../components/Header";
import { API_URL } from "../helper";
import {
  FormErrorMessage,
  FormHelperText,
  Switch,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter } from "@chakra-ui/react";
import { ModalBody, ModalCloseButton, Button, FormControl } from "@chakra-ui/react";
import { Input, FormLabel, Table, Thead } from "@chakra-ui/react";
import { TableContainer, Alert, AlertIcon, AlertDescription } from "@chakra-ui/react";
import { Tbody, Tr, Th, Td, TableCaption, IconButton } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon, ArrowRightIcon, ArrowLeftIcon } from "@chakra-ui/icons";
import ReactPaginate from "react-paginate";

function Cashier(props) {
  const [cashier, setCashier] = React.useState([]);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [edit, setEdit] = React.useState(false);
  const [match, setMatch] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const onBtnRegis = async () => {
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      setIsError(true);
    } else if (password !== confirmPassword) {
      setMatch(false);
    } else {
      try {
        let response = await Axios.post(API_URL + "/users/regis", {
          firstName,
          lastName,
          email,
          phone,
          location,
          password,
        });
        if (response.data.success) {
          getCashierData();
          updateToast(true, response.data.message);
          onBtnClose();
        } else {
          updateToast(false, response.data.message);
          onBtnClose();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const clearInput = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setLocation("");
    setPassword("");
    setConfirmPassword("");
  };

  const [sortBy, setSortBy] = React.useState("");
  const [desc, setDesc] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [pages, setPages] = React.useState(0);
  const [rows, setRows] = React.useState(0);

  const [filterName, setFilterName] = React.useState("");
  const [filterLoc, setFilterLoc] = React.useState("");

  const getCashierData = async () => {
    let reqURI = ["/users/all?"];
    let reqQuery = [];
    if (filterName !== "") {
      reqQuery.push(`name=${filterName}`);
    }
    if (filterLoc !== "") {
      reqQuery.push(`location=${filterLoc}`);
    }
    if (sortBy !== "") {
      reqQuery.push(`sortby=${sortBy}`);
    }
    if (desc) {
      reqQuery.push(`order=desc`);
    }
    console.log(reqURI + reqQuery.join("&"));
    try {
      let response = await Axios.get(API_URL + reqURI + reqQuery.join("&"));
      setCashier(response.data.rows);
      // setPage(response.data.page);
      // setPages(response.data.totalPage);
      // setRows(response.data.totalRows);
    } catch (error) {
      console.log(error);
      setCashier([]);
    }
  };

  const [editId, setEditId] = React.useState("");
  const [editFName, setEditFName] = React.useState("");
  const [editLName, setEditLName] = React.useState("");
  const [editEmail, setEditEmail] = React.useState("");
  const [editPhone, setEditPhone] = React.useState("");
  const [editLocation, setEditLocation] = React.useState("");

  const onBtnEdit = (editData) => {
    const { idusers, firstName, lastName, email, phone, location } = editData;
    setEdit(true);
    setEditId(idusers);
    setEditFName(firstName);
    setEditLName(lastName);
    setEditEmail(email);
    setEditPhone(phone);
    setEditLocation(location);
    onOpen();
  };

  const onBtnClose = () => {
    setEdit(false);
    setMatch(true);
    clearInput();
    onClose();
  };

  const [isEmpty, setIsEmpty] = React.useState(false);

  const onBtnUpdate = async () => {
    if (editFName === "" || editLName === "" || editEmail === "") {
      setIsEmpty(true);
    } else {
      try {
        let response = await Axios.patch(API_URL + `/users/${editId}`, {
          firstName: editFName.toLowerCase(),
          lastName: editLName.toLowerCase(),
          email: editEmail.toLowerCase(),
          phone: editPhone,
          location: editLocation.toLowerCase(),
        });
        if (response.data.success) {
          getCashierData();
          updateToast(true, response.data.message);
          onBtnClose();
        }
      } catch (error) {
        updateToast(false);
        console.log(error);
      }
    }
  };

  const onBtnSwitch = async (id, status) => {
    let changeStatus = status === "active" ? "not active" : "active";
    try {
      let response = await Axios.patch(API_URL + `/users/${id}`, {
        status: changeStatus,
      });
      if (response.data.success) {
        getCashierData();
        updateToast(true, response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateToast = (success, message = "Oops Something Went Wrong") => {
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

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const renderModalContent = () => {
    if (edit) {
      return (
        <ModalContent>
          <ModalHeader>Edit Cashier Data</ModalHeader>
          <ModalCloseButton onChange={onBtnClose} />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>First name</FormLabel>
              <Input
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                type="text"
                onChange={(event) => setEditFName(event.target.value)}
                ref={initialRef}
                value={editFName}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Last name</FormLabel>
              <Input
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                type="text"
                onChange={(event) => setEditLName(event.target.value)}
                value={editLName}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                type="email"
                onChange={(event) => setEditEmail(event.target.value)}
                value={editEmail}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Phone</FormLabel>
              <Input
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                type="tel"
                onChange={(event) => setEditPhone(event.target.value)}
                value={editPhone}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Location</FormLabel>
              <Input
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                type="text"
                onChange={(event) => setEditLocation(event.target.value)}
                value={editLocation}
              />
            </FormControl>
          </ModalBody>
          <div className="d-flex flex-row justify-content-center px-4">
            <Alert hidden={!isEmpty} status="warning" variant="subtle" justifyContent="center">
              <AlertIcon />
              <AlertDescription>Required field can not be empty</AlertDescription>
            </Alert>
          </div>
          <ModalFooter>
            <Button onClick={onBtnUpdate} colorScheme="red" mr={3}>
              Update Data
            </Button>
            <Button onClick={onBtnClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      );
    } else {
      return (
        <ModalContent>
          <ModalHeader>Create new account</ModalHeader>
          <ModalCloseButton onChange={onBtnClose} />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>First name</FormLabel>
              <Input
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                type="text"
                onChange={(event) => setFirstName(event.target.value)}
                ref={initialRef}
                placeholder="First name"
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Last name</FormLabel>
              <Input
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                type="text"
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Last name"
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                type="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Phone</FormLabel>
              <Input
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                type="tel"
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Location</FormLabel>
              <Input
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                type="text"
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Location"
              />
            </FormControl>

            <FormControl mt={4} isRequired isInvalid={!match}>
              <FormLabel>Password</FormLabel>
              <Input
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
              />
              {match ? (
                <FormHelperText>
                  Min. 5 characters long. Must contain at least 1 number
                </FormHelperText>
              ) : (
                <FormErrorMessage>Password does not match</FormErrorMessage>
              )}
            </FormControl>

            <FormControl mt={4} isRequired isInvalid={!match}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                type="password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm Password"
                onKeyDown={() => setMatch(true)}
              />
              {match ? (
                <FormHelperText>Password must match</FormHelperText>
              ) : (
                <FormErrorMessage>Password does not match</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <div className="d-flex flex-column gap-3 justify-content-center px-5">
            <Alert hidden={!isError} status="warning" variant="subtle" justifyContent="center">
              <AlertIcon />
              <AlertDescription>Required field can not be empty</AlertDescription>
            </Alert>
          </div>
          <ModalFooter>
            <Button onClick={onBtnRegis} colorScheme="red" mr={3}>
              Register
            </Button>
            <Button onClick={onBtnClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      );
    }
  };

  const renderData = () => {
    if (cashier.length === 0) {
      return (
        <Tr>
          <Td colSpan="7">
            <div className="text-center">DATA NOT FOUND</div>
          </Td>
        </Tr>
      );
    }
    return cashier.map((val, idx) => {
      const { idusers, firstName, lastName, email, phone, location, status } = val;
      return (
        <Tr key={idx}>
          <Td>{idusers}</Td>
          <Td textTransform="capitalize">{firstName}</Td>
          <Td textTransform="capitalize">{lastName}</Td>
          <Td>{email}</Td>
          <Td>{phone === "" ? "-" : phone}</Td>
          <Td textTransform="capitalize">{location === "" ? "-" : location}</Td>
          <Td>
            <button onClick={() => onBtnEdit(val)} type="button" className="btn btn-outline-danger">
              Edit
            </button>
          </Td>
          <Td>
            <Switch isChecked={status === "active"} onChange={() => onBtnSwitch(idusers, status)} />
          </Td>
        </Tr>
      );
    });
  };

  useEffect(() => {
    getCashierData();
  }, [desc]);

  const initialRef = React.useRef(null);

  return (
    <div className="container-fluid mx-3 mt-3">
      <Header open={onOpen} pageName="Cashier" />
      <div
        style={{ width: "min-content" }}
        className=" p-3 d-flex flex-column gap-3 align-items-right justify-content-start border border-secondary rounded-3"
      >
        <h5 className="h5">Filter By:</h5>

        <FormControl>
          <FormLabel color="gray.500" fontSize="14px">
            Name
          </FormLabel>
          <Input
            w={200}
            focusBorderColor="#E96F16"
            rounded={6}
            shadow="sm"
            size="sm"
            type="text"
            onChange={(e) => setFilterName(e.target.value)}
            onKeyUp={getCashierData}
          />
        </FormControl>

        <FormControl>
          <FormLabel color="gray.500" fontSize="14px">
            Location
          </FormLabel>
          <Input
            w={200}
            focusBorderColor="#E96F16"
            rounded={6}
            shadow="sm"
            size="sm"
            type="text"
            onChange={(e) => setFilterLoc(e.target.value)}
            onKeyUp={getCashierData}
          />
        </FormControl>
      </div>

      <TableContainer mt="6">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>
                <Button
                  type="button"
                  rightIcon={desc ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  colorScheme="gray"
                  variant="link"
                  onClick={() => {
                    setDesc(!desc);
                    setSortBy("idusers");
                  }}
                >
                  ID
                </Button>
              </Th>
              <Th>
                <Button
                  type="button"
                  rightIcon={desc ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  colorScheme="gray"
                  variant="link"
                  onClick={() => {
                    setDesc(!desc);
                    setSortBy("firstName");
                  }}
                >
                  First Name
                </Button>
              </Th>
              <Th>
                <Button
                  type="button"
                  rightIcon={desc ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  colorScheme="gray"
                  variant="link"
                  onClick={() => {
                    setDesc(!desc);
                    setSortBy("lastName");
                  }}
                >
                  Last Name
                </Button>
              </Th>
              <Th>
                <Button
                  type="button"
                  rightIcon={desc ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  colorScheme="gray"
                  variant="link"
                  onClick={() => {
                    setDesc(!desc);
                    setSortBy("email");
                  }}
                >
                  Email
                </Button>
              </Th>
              <Th>
                <Button
                  type="button"
                  rightIcon={desc ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  colorScheme="gray"
                  variant="link"
                  onClick={() => {
                    setDesc(!desc);
                    setSortBy("phone");
                  }}
                >
                  Phone
                </Button>
              </Th>
              <Th>
                <Button
                  type="button"
                  rightIcon={desc ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  colorScheme="gray"
                  variant="link"
                  onClick={() => {
                    setDesc(!desc);
                    setSortBy("location");
                  }}
                >
                  Location
                </Button>
              </Th>
              <Th>
                <Button type="button" colorScheme="gray" variant="link">
                  Action
                </Button>
              </Th>
              <Th>
                <Button type="button" colorScheme="gray" variant="link">
                  Active
                </Button>
              </Th>
            </Tr>
          </Thead>
          <Tbody>{renderData()}</Tbody>
          <TableCaption>
            <div className="d-flex justify-content-start">
              Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
            </div>
            <div key={rows} className="d-flex flex-row gap-5 justify-content-center">
              <ReactPaginate
                previousLabel={
                  <IconButton variant="ghost" colorScheme="red" icon={<ArrowLeftIcon />} />
                }
                nextLabel={
                  <IconButton variant="ghost" colorScheme="red" icon={<ArrowRightIcon />} />
                }
                pageCount={Math.min(10, pages)}
                onPageChange={changePage}
                containerClassName="d-flex align-items-center justify-content-center gap-3 pagination"
                activeClassName="page-item active"
                pageLinkClassName="page-link"
              />
            </div>
          </TableCaption>
        </Table>
      </TableContainer>

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

export default Cashier;
