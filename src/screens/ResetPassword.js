import { memo, useState } from "react";
import { Grid, Typography, Link, InputAdornment } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useSnackbar } from "../utils/index.js";
import Spinner from "../components/Spinner.js";
import background from "../assets/images/background.png";
import { resetPassword } from "../api/index.js";
import Form from "../components/Form.js";

const useStyles = makeStyles((theme) => ({
	root: {
		overflow: "hidden",
		width: "100vw",
		height: "100%",
		backgroundImage: `url(${background})`,
		backgroundPosition: "center",
		backgroundSize: "cover",
	},
	title: {
		color: theme.palette.common.white,
		letterSpacing: theme.spacing(0.1),
		maxWidth: "300px",
	},
	subtitle: {
		color: theme.palette.secondary.main,
		letterSpacing: theme.spacing(0.1),
		maxWidth: "300px",
	},
}));

const ResetPassword = () => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const token = urlParams.get("token");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const classes = useStyles();
	const { success, error } = useSnackbar();
	const navigate = useNavigate();

	const [showPassword, setShowPassword] = useState(false);

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const submitHandler = async (values) => {
		setIsSubmitting(true);

		try {
			const { success: successCode, message } = await resetPassword(values.password, token);

			if (successCode) {
				success(message);
				navigate("/");
			} else {
				error(message);
			}
		} catch (error_) {
			console.log(error_);
		}

		setIsSubmitting(false);
	};

	const formContent = [
		{
			customType: "input",
			id: "password",
			type: showPassword ? "text" : "password",
			placeholder: "New Password",
			inputProps: {
				endAdornment: (
					<InputAdornment position="start">
						<IconButton
							aria-label="toggle password visibility"
							tabIndex={-1}
							onClick={handleShowPassword}
						>
							{showPassword ? <Visibility /> : <VisibilityOff />}
						</IconButton>
					</InputAdornment>
				),
			},
		},
		{
			customType: "input",
			id: "confirmPassword",
			type: showPassword ? "text" : "password",
			placeholder: "Re-type New Password",
			inputProps: {
				endAdornment: (
					<InputAdornment position="start">
						<IconButton
							aria-label="toggle password visibility"
							tabIndex={-1}
							onClick={handleShowPassword}
						>
							{showPassword ? <Visibility /> : <VisibilityOff />}
						</IconButton>
					</InputAdornment>
				),
			},
		},
		{
			customType: "button",
			id: "submit",
			type: "submit",
			text: "Change Password",
		},
	];

	return (
		<>
			<Spinner open={isSubmitting} />
			<Grid container direction="row" justifyContent="center" align="center" className={classes.root}>
				<Grid item container direction="column" justifyContent="center" align="center" sm={5} xs={12} sx={{ "> .MuiGrid-item": { p: 1 } }}>
					<Grid item mt={2}>
						<Typography variant="h4" className={classes.title}>{"Reset Password"}</Typography>
					</Grid>
					<Grid item container direction="column" justifyContent="center" alignItems="center">
						<Form content={formContent} validationSchema="resetPasswordSchema" onSubmit={submitHandler} />
					</Grid>
					<Grid item container direction="column" justifyContent="center" alignItems="space-between">
						<Grid item>
							<Typography variant="h7" color="white.main">{"Otherwise, "}</Typography>
							<Typography variant="h7" className={classes.subtitle}>
								<Link color="inherit" underline="none" href="/">{"Sign In"}</Link>
							</Typography>
						</Grid>
					</Grid>
				</Grid>
				<Grid item sm={7} />
			</Grid>
		</>
	);
};

export default memo(ResetPassword);
