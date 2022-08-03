import { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

const buttons = ["OPEN ORDERS", "IN PLAY", "TO CLAIM", "CLAIMED"];

type Props = {
  page: String,
  setPage: React.Dispatch<React.SetStateAction<any>>,
  setIsShowOpenOrder: React.Dispatch<React.SetStateAction<any>>,
};

function Menu({ page, setPage, setIsShowOpenOrder }: Props) {
  return (
    <div className="flex p-7 w-full justify-center md:justify-start">
      <div className="flex flex-col lg:flex-row justify-between items-center w-full">
        <ButtonGroup size="medium" aria-label="large button group">
          {buttons.map((button) => {
            const variant = button === page ? "contained" : "outlined";
            return (
              <Button key={button} onClick={() => setPage(button)} variant={variant}>
                {button}
              </Button>
            );
          })}
        </ButtonGroup>
        <div className="mt-5 lg:mt-0">
          <Button onClick={() => setIsShowOpenOrder(true)} variant="contained" color="secondary">CREATE ORDER</Button>
        </div>
      </div>
    </div>
  );
}

export default Menu;
