import {
    Box,
    Dialog,
    Paper,
    Slide,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";
import {forwardRef, useEffect, useState} from "react";
import AmountDecorate from "../utils/AmountDecorate";
import {user_per_invest_type_details} from "../utils/apis";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function InvestmentTypeUserDetail(params) {
    const {user, onClose} = params;
    const [open, setOpen] = useState(params.openDialog);
    const [details, setDetails] = useState([]);

    useEffect(() => {
        if (user) {
            user_per_invest_type_details(user, (data) => {
                setDetails(data);
            });
        }
    }, [user]);

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    const getSum = (fieldName) => {
        var sum = 0;
        details.forEach((element) => {
            sum += element[fieldName];
        });

        return sum;
    };

    return (
        <Dialog open={open} TransitionComponent={Transition} onClose={handleClose}>
            <Box p={2}>
                <Box p={2} mb={2} border={1} borderRadius={10}>
                    <Box mb={1}>
                        {"نام کاربر: "}
                        {user.name}
                    </Box>


                </Box>
                <Box>
                    <TableContainer component={Paper} style={{direction: "rtl"}}>
                        <Table>
                            <TableHead style={{backgroundColor: "orange"}}>
                                <TableRow>
                                    <TableCell align="center">ردیف</TableCell>
                                    <TableCell align="center"> نوع دارایی </TableCell>
                                    <TableCell align="center">مقدار خریداری شده</TableCell>
                                    <TableCell align="center">مقدار خرج شده</TableCell>
                                    <TableCell align="center">مانده</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {details.map((row, idx) => {
                                    return (
                                        <TableRow key={idx}>
                                            <TableCell align="center">{idx + 1}</TableCell>
                                            <TableCell align="center"> {row.type.name} </TableCell>
                                            <TableCell align="center">
                                                <AmountDecorate amount={row.amount}/>
                                            </TableCell>
                                            <TableCell align="center">
                                                <AmountDecorate amount={row.spentAmount}/>
                                            </TableCell>
                                            <TableCell align="center">
                                                <AmountDecorate amount={row.remain}/>
                                            </TableCell>

                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Dialog>
    );
}
