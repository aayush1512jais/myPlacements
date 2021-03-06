import React, { useEffect, useState } from "react";
import {
  Button,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  Icon,
  Typography,
} from "@material-ui/core";
import { orange } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/styles";
import { FuseAnimate, FusePageCarded, FuseChipSelect, FuseUtils } from "@fuse";
import { useForm } from "@fuse/hooks";
import { Link } from "react-router-dom";
import clsx from "clsx";
import _ from "@lodash";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import * as Actions from "../store/actions";
import reducer from "../store/reducers";
import VerificationStatus from "./VerificationStatus";
//import { Container, Row, Col } from "reactstrap";
//import useDatePicker from "../products/useDatePicker";
//import { DatePicker } from "@material-ui/pickers";
//import DatePicker from "react-datepicker";

//import "react-datepicker/dist/react-datepicker.css";

const useStyles = makeStyles((theme) => ({
  productImageFeaturedStar: {
    position: "absolute",
    top: 0,
    right: 0,
    color: orange[400],
    opacity: 0,
  },
  productImageUpload: {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },
  productImageItem: {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    "&:hover": {
      "& $productImageFeaturedStar": {
        opacity: 0.8,
      },
    },
    "&.featured": {
      pointerEvents: "none",
      boxShadow: theme.shadows[3],
      "& $productImageFeaturedStar": {
        opacity: 1,
      },
      "&:hover $productImageFeaturedStar": {
        opacity: 1,
      },
    },
  },
}));

function User(props) {
  const dispatch = useDispatch();
  const user = useSelector(({ userManagerApp }) => userManagerApp.user);

  const classes = useStyles(props);
  const [tabValue, setTabValue] = useState(0);
  const { form, handleChange, setForm } = useForm(null);

  useEffect(() => {
    function updateUserState() {
      const params = props.match.params;
      const { userId } = params;

      // if (productId === "new") {
      //   dispatch(Actions.newUser());
      // } else {
      dispatch(Actions.getUser(userId));
      //}
    }

    updateUserState();
  }, [dispatch, props.match.params]);

  useEffect(() => {
    if (
      (user.data[0] && !form) ||
      (user.data[0] && form && user.data[0].id !== form.id)
    ) {
      setForm(user.data[0]);
    }
  }, [form, user.data[0], setForm]);

  function handleChangeTab(event, tabValue) {
    setTabValue(tabValue);
  }

  function handleChipChange(value, name) {
    setForm(
      _.set(
        { ...form },
        name,
        value.map((item) => item.value)
      )
    );
  }

  // function dateOfBirth(val) {
  //   const [startDate, setStartDate] = useState(val);
  //   return (
  //     <DatePicker
  //       dateFormat="dd MMM yyyy"
  //       selected={startDate}
  //       onChange={(date) => setStartDate(date)}
  //     />
  //   );
  // }

  function setFeaturedImage(id) {
    setForm(_.set({ ...form }, "featuredImageId", id));
  }

  function handleUploadChange(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = () => {
      setForm(
        _.set({ ...form }, `images`, [
          {
            id: FuseUtils.generateGUID(),
            url: `data:${file.type};base64,${btoa(reader.result)}`,
            type: "image",
          },
          ...form.images,
        ])
      );
    };

    reader.onerror = function () {
      console.log("error on load image");
    };
  }

  function canBeSubmitted() {
    return !_.isEqual(user.data[0], form);
    //return form.name.length > 0 && !_.isEqual(user.data[0], form);
  }

  return (
    <FusePageCarded
      classes={{
        toolbar: "p-0",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
      }}
      header={
        form && (
          <div className="flex flex-1 w-full items-center justify-between">
            <div className="flex flex-col items-start max-w-full">
              <FuseAnimate animation="transition.slideRightIn" delay={300}>
                <Typography
                  className="normal-case flex items-center sm:mb-12"
                  component={Link}
                  role="button"
                  to="/apps/user-manager/users"
                  color="inherit"
                >
                  <Icon className="mr-4 text-20">arrow_back</Icon>
                  Users
                </Typography>
              </FuseAnimate>

              <div className="flex items-center max-w-full">
                {/*
                <FuseAnimate animation="transition.expandIn" delay={300}>
                  {form.images.length > 0 && form.featuredImageId ? (
                    <img
                      className="w-32 sm:w-48 mr-8 sm:mr-16 rounded"
                      src={
                        _.find(form.images, { id: form.featuredImageId }).url
                      }
                      alt={form.name}
                    />
                  ) : (
                    <img
                      className="w-32 sm:w-48 mr-8 sm:mr-16 rounded"
                      src="assets/images/ecommerce/product-image-placeholder.png"
                      alt={form.name}
                    />
                  )}
                </FuseAnimate>
                  */}
                <div className="flex flex-col min-w-0">
                  <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography className="text-16 sm:text-20 truncate">
                      {form.name ? form.name : "New User"}
                    </Typography>
                  </FuseAnimate>

                  <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography variant="caption">User Detail</Typography>
                  </FuseAnimate>
                </div>
              </div>
              <div className="flex flex-col min-w-1">
                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                  <VerificationStatus
                    name={form.verified ? "Verified" : "Not Verified"}
                  />
                </FuseAnimate>
              </div>
            </div>

            <FuseAnimate animation="transition.slideRightIn" delay={300}>
              <Button
                className="whitespace-no-wrap"
                variant="contained"
                disabled={!canBeSubmitted()}
                onClick={() => dispatch(Actions.saveUser(form))}
              >
                Save
              </Button>
            </FuseAnimate>
          </div>
        )
      }
      contentToolbar={
        form && (
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="fixed"
            classes={{ root: "w-full h-64" }}
          >
            <Tab className="h-64 normal-case" label="Basic Info" />
            {form.role === "Student" && (
              <Tab className="h-64 normal-case" label="Academic Details" />
            )}
            {/*
           <Tab className="h-64 normal-case" label="Pricing" />
          <Tab className="h-64 normal-case" label="Inventory" />
          <Tab className="h-64 normal-case" label="Shipping" />
          */}
          </Tabs>
        )
      }
      content={
        form && (
          <div className="p-16 sm:p-24 max-w-2xl">
            {tabValue === 0 && (
              <div>
                <TextField
                  className="mt-8 mb-20"
                  error={form.name === ""}
                  required
                  label="Name"
                  autoFocus
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                />

                <TextField
                  className="mt-12 mb-16"
                  id="email"
                  name="email"
                  //onChange={handleChange}
                  label="E-mail"
                  fontSize="5x1"
                  type="text"
                  value={form.email}
                  //multiline
                  //rows={5}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  className="mt-8 mb-20"
                  error={form.name === ""}
                  required
                  label="Phone Number"
                  //autoFocus
                  id="phoneNo"
                  name="phoneNo"
                  value={form.phoneNo}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  className="mt-8 mb-20"
                  error={form.name === ""}
                  required
                  label="Unique ID"
                  //autoFocus
                  id="uniqieId"
                  name="uniqueId"
                  value={form.uniqueId}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  className="mt-8 mb-20"
                  error={form.name === ""}
                  required
                  label="Department"
                  //autoFocus
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  className="mt-8 mb-20"
                  error={form.name === ""}
                  required
                  label="Gender"
                  //autoFocus
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                />

                <TextField
                  className="mb-24"
                  id="bday"
                  label="Birthday"
                  type="date"
                  name="bday"
                  //value={<useDatePicker val={form.dob} />}
                  value={form.bday}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  fullWidth
                />

                {/*
                <FuseChipSelect
                  className="mt-8 mb-24"
                  value={form.categories.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  onChange={(value) => handleChipChange(value, "categories")}
                  placeholder="Select multiple categories"
                  textFieldProps={{
                    label: "Categories",
                    InputLabelProps: {
                      shrink: true,
                    },
                    variant: "outlined",
                  }}
                  isMulti
                />

                <FuseChipSelect
                  className="mt-8 mb-16"
                  value={form.tags.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  onChange={(value) => handleChipChange(value, "tags")}
                  placeholder="Select multiple tags"
                  textFieldProps={{
                    label: "Tags",
                    InputLabelProps: {
                      shrink: true,
                    },
                    variant: "outlined",
                  }}
                  isMulti
                />
                */}
              </div>
            )}
            {tabValue === 1 && (
              <div>
                <input
                  accept="image/*"
                  className="hidden"
                  id="button-file"
                  type="file"
                  onChange={handleUploadChange}
                />
                <div className="flex justify-center sm:justify-start flex-wrap">
                  <label
                    htmlFor="button-file"
                    className={clsx(
                      classes.productImageUpload,
                      "flex items-center justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
                    )}
                  >
                    <Icon fontSize="large" color="action">
                      cloud_upload
                    </Icon>
                  </label>
                  {/*
                  {form.images.map((media) => (
                    <div
                      onClick={() => setFeaturedImage(media.id)}
                      className={clsx(
                        classes.productImageItem,
                        "flex items-center justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5",
                        media.id === form.featuredImageId && "featured"
                      )}
                      key={media.id}
                    >
                      <Icon className={classes.productImageFeaturedStar}>
                        star
                      </Icon>
                      <img
                        className="max-w-none w-auto h-full"
                        src={media.url}
                        alt="product"
                      />
                    </div>
                  ))}
                      */}
                </div>
              </div>
            )}
            {/*
            {tabValue === 2 && (
              <div>
                <TextField
                  className="mt-8 mb-16"
                  label="Tax Excluded Price"
                  id="priceTaxExcl"
                  name="priceTaxExcl"
                  value={form.priceTaxExcl}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  type="number"
                  variant="outlined"
                  autoFocus
                  fullWidth
                />

                <TextField
                  className="mt-8 mb-16"
                  label="Tax Included Price"
                  id="priceTaxIncl"
                  name="priceTaxIncl"
                  value={form.priceTaxIncl}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  type="number"
                  variant="outlined"
                  fullWidth
                />

                <TextField
                  className="mt-8 mb-16"
                  label="Tax Rate"
                  id="taxRate"
                  name="taxRate"
                  value={form.taxRate}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  type="number"
                  variant="outlined"
                  fullWidth
                />

                <TextField
                  className="mt-8 mb-16"
                  label="Compared Price"
                  id="comparedPrice"
                  name="comparedPrice"
                  value={form.comparedPrice}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  type="number"
                  variant="outlined"
                  fullWidth
                  helperText="Add a compare price to show next to the real price"
                />
              </div>
            )}
            {tabValue === 3 && (
              <div>
                <TextField
                  className="mt-8 mb-16"
                  required
                  label="SKU"
                  autoFocus
                  id="sku"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                />

                <TextField
                  className="mt-8 mb-16"
                  label="Quantity"
                  id="quantity"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  variant="outlined"
                  type="number"
                  fullWidth
                />
              </div>
            )}
            {tabValue === 4 && (
              <div>
                <div className="flex">
                  <TextField
                    className="mt-8 mb-16 mr-8"
                    label="Width"
                    autoFocus
                    id="width"
                    name="width"
                    value={form.width}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                  />

                  <TextField
                    className="mt-8 mb-16 mr-8"
                    label="Height"
                    id="height"
                    name="height"
                    value={form.height}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                  />

                  <TextField
                    className="mt-8 mb-16 mr-8"
                    label="Depth"
                    id="depth"
                    name="depth"
                    value={form.depth}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                  />
                </div>

                <TextField
                  className="mt-8 mb-16"
                  label="Weight"
                  id="weight"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                />

                <TextField
                  className="mt-8 mb-16"
                  label="Extra Shipping Fee"
                  id="extraShippingFee"
                  name="extraShippingFee"
                  value={form.extraShippingFee}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              </div>
            )}
                */}
          </div>
        )
      }
      //innerScroll
    />
  );
}

export default withReducer("userManagerApp", reducer)(User);
