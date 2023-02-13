import React, { useEffect } from "react";
import Axios from "axios";
import Header from "../components/Header";
import { API_URL } from "../helper";
import {
  FormErrorMessage,
  FormHelperText,
  Heading,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter } from "@chakra-ui/react";
import { ModalBody, ModalCloseButton, Button, FormControl, Image } from "@chakra-ui/react";
import { Input, FormLabel, Table, Thead, TableContainer, Text } from "@chakra-ui/react";
import { Tbody, Tr, Th, Td, TableCaption, IconButton, Select, Textarea } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon, ArrowRightIcon, ArrowLeftIcon } from "@chakra-ui/icons";
import ReactPaginate from "react-paginate";

function Transaction(props) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [transaction, setTransaction] = React.useState([]);
  const [transactionDetail, setTransactionDetail] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [pages, setPages] = React.useState(0);
  const [rows, setRows] = React.useState(0);
  const [sortBy, setSortBy] = React.useState("");
  const [desc, setDesc] = React.useState(false);
  const [tranStatus, setTranStatus] = React.useState(["unpaid", "pending", "paid"]);

  const [filterOrderId, setFilterOrderId] = React.useState("");
  const [filterName, setFilterName] = React.useState("");

  const [edit, setEdit] = React.useState(false);
  const [editId, setEditId] = React.useState(false);
  const [editNote, setEditNote] = React.useState(" ");

  const getTransactionData = async () => {
    try {
      let response = await Axios.get(API_URL + `/transactions/all`);
      console.log();
      setTransaction(response.data);
      //   setPage(response.data.page);
      //   setPages(response.data.totalPage);
      //   setRows(response.data.totalRows);
    } catch (error) {
      console.log(error);
      setTransaction([]);
    }
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

  const onBtnEdit = (val) => {
    setEdit(true);
    setEditNote(val.notes);
    setEditId(val.idtransactions);
    onOpen();
  };

  const onBtnClose = () => {
    setEdit(false);
    onClose();
  };

  const onBtnUpdate = async (id) => {
    try {
      let response = await Axios.patch(API_URL + `/transactions/${id}`, {
        notes: editNote,
      });
      if (response.data.success) {
        getTransactionData();
        displayToast(true, response.data.message);
        onBtnClose();
      }
    } catch (error) {
      console.log();
    }
  };

  const onBtnDetails = async (id) => {
    try {
      let response = await Axios.get(API_URL + `/transactions/detail/${id}`);
      console.log(response.data);
      setTransactionDetail(response.data);
      onOpen();
    } catch (error) {
      console.log(error);
    }
  };

  const onBtnChangeStatus = async (status, id) => {
    try {
      let response = await Axios.patch(API_URL + `/transactions/${id}`, {
        status,
      });
      if (response.data.success) {
        getTransactionData();
        displayToast(true, response.data.message);
      }
    } catch (error) {
      console.log();
    }
  };

  const renderData = () => {
    if (transaction.length === 0) {
      return (
        <Tr>
          <Td colSpan={5}>
            <div className="text-center">DATA NOT FOUND</div>
          </Td>
        </Tr>
      );
    }

    return transaction.map((val) => {
      const { idtransactions, orderId, status, notes, createdAt, user } = val;
      return (
        <Tr key={idtransactions}>
          <Td>#{orderId}</Td>
          <Td textTransform="capitalize">
            {user.firstName} {user.lastName}
          </Td>
          <Td>{notes ? notes : "-"}</Td>
          <Td>{createdAt.split("T")[0]}</Td>
          <Td>
            <div className="d-flex w-100">
              {status === "unpaid" ? (
                <Button width="50%" isActive="false" textTransform="capitalize" colorScheme="red">
                  {status}
                </Button>
              ) : status === "pending" ? (
                <Button
                  width="50%"
                  isActive="false"
                  textTransform="capitalize"
                  colorScheme="yellow"
                >
                  {status}
                </Button>
              ) : (
                <Button
                  width="50%"
                  isActive="false"
                  textTransform="capitalize"
                  colorScheme="telegram"
                >
                  {status}
                </Button>
              )}
            </div>
          </Td>
          <Td>
            <div className="d-flex gap-2">
              <button
                onClick={() => onBtnEdit(val)}
                type="button"
                className="btn btn-outline-danger"
              >
                Edit
              </button>
              <button
                onClick={() => onBtnDetails(idtransactions)}
                type="button"
                className="btn btn-outline-secondary"
              >
                Details
              </button>
            </div>
          </Td>
          <Td>
            <Select
              focusBorderColor="#E96F16"
              rounded={6}
              shadow="sm"
              disabled={status === "paid"}
              onChange={(e) => onBtnChangeStatus(e.target.value, idtransactions)}
              defaultValue={status}
            >
              {tranStatus.map((val, idx) => {
                return (
                  <option style={{ textTransform: "capitalize" }} value={val} key={idx}>
                    {val}
                  </option>
                );
              })}
            </Select>
          </Td>
        </Tr>
      );
    });
  };

  const renderModalContent = () => {
    let grandTotal = 0;
    if (edit) {
      return (
        <ModalContent>
          <ModalHeader>Edit Transaction Note</ModalHeader>
          <ModalCloseButton onChange={onBtnClose} />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>Note</FormLabel>
              <Textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                focusBorderColor="#E96F16"
                rounded={6}
                shadow="sm"
                resize="none"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => onBtnUpdate(editId)} colorScheme="red" mr={3}>
              Update Note
            </Button>
            <Button onClick={onBtnClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      );
    } else {
      return (
        <ModalContent>
          <div className="d-flex justify-content-between">
            <Text as="b" px={6} py={4} fontSize="2xl">
              Transaction Detail
            </Text>
            <Text as="b" pr={20} py={4} fontSize="2xl">
              Status:{" "}
              {transactionDetail.length > 0 ? transactionDetail[0].transaction.status : null}
            </Text>
          </div>
          <div className="d-flex flex-row justify-content-between mt-5">
            <Text fontSize="xl" ps={6}>
              ORDER ID: #
              {transactionDetail.length > 0 ? transactionDetail[0].transaction.orderId : null}
            </Text>
            <Text fontSize="xl" textTransform="capitalize" pe={6}>
              Created By:
              {transactionDetail.length > 0
                ? `${transactionDetail[0].transaction.user.firstName}
                ${transactionDetail[0].transaction.user.lastName}`
                : null}
            </Text>
          </div>
          <ModalCloseButton onChange={onBtnClose} />
          <ModalBody pb={6}>
            <TableContainer whiteSpace="nowrap">
              <Table variant="simple" size="md">
                <Thead>
                  <Tr>
                    <Th pl={0}>Item</Th>
                    <Th></Th>
                    <Th textAlign="center">Amount</Th>
                    <Th textAlign="center">Price</Th>
                    <Th isNumeric>Total Price</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactionDetail.map((val, idx) => {
                    const { amount, total } = val;
                    const { name, price, productImg } = val.product;
                    grandTotal += parseFloat(total);
                    return (
                      <Tr key={idx}>
                        <Td colSpan={2} px={0} textTransform="capitalize">
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
                          <div className="d-flex justify-content-center">
                            <Text fontSize="xl">{amount}</Text>
                          </div>
                        </Td>
                        <Td>
                          <div className="d-flex justify-content-center">
                            <Text fontSize="xl">Rp. {parseFloat(price).toLocaleString("id")}</Text>
                          </div>
                        </Td>
                        <Td isNumeric>
                          <div className="d-flex justify-content-center">
                            <Text color="#008D96" fontSize="xl">
                              Rp. {parseFloat(total).toLocaleString("id")}
                            </Text>
                          </div>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
          <ModalFooter>
            <div className="d-flex flex-column gap-3">
              <div>
                <Text color="#008D96" fontSize="3xl">
                  Total Spent: Rp. {grandTotal.toLocaleString("id")}
                </Text>
              </div>
              <div className="d-flex flex-row justify-content-end gap-4">
                <Button onClick={onBtnClose}>Close</Button>
              </div>
            </div>
          </ModalFooter>
        </ModalContent>
      );
    }
  };

  useEffect(() => {
    getTransactionData();
  }, []);

  return (
    <div className="container-fluid mx-3 mt-3">
      <Header pageName="Transaction" />
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
            onKeyUp={getTransactionData}
          />
        </FormControl>

        <FormControl>
          <FormLabel color="gray.500" fontSize="14px">
            Order ID
          </FormLabel>
          <Input
            w={200}
            focusBorderColor="#E96F16"
            rounded={6}
            shadow="sm"
            size="sm"
            type="text"
            onChange={(e) => setFilterOrderId(e.target.value)}
            onKeyUp={getTransactionData}
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
                    setSortBy("orderId");
                  }}
                >
                  Order ID
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
                  Created By
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
                    setSortBy("notes");
                  }}
                >
                  Notes
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
                    setSortBy("createdAt");
                  }}
                >
                  Date
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
                    setSortBy("status");
                  }}
                >
                  Status
                </Button>
              </Th>
              <Th>
                <Button type="button" colorScheme="gray" variant="link">
                  Action
                </Button>
              </Th>
              <Th>
                <Button type="button" colorScheme="gray" variant="link">
                  Set Status
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
                containerClassName="d-flex align-items-center justify-content-center gap-3 pagination"
                activeClassName="page-item active"
                pageLinkClassName="page-link"
              />
            </div>
          </TableCaption>
        </Table>
      </TableContainer>

      <Modal isOpen={isOpen} onClose={onBtnClose} isCentered size="2xl">
        <ModalOverlay />
        {renderModalContent()}
      </Modal>
    </div>
  );
}

export default Transaction;
