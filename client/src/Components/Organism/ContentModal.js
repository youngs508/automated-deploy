import styled from "styled-components";
import { Fragment } from "react";
import STYLE from "../../config"
import SubmitButton from "../Atoms/SubmitButton"

const Div = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 99;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Div2 = styled.div`
  width: 20em;
  border: 0.1em solid ${STYLE.BORDER_COLOR};
  text-align: center;
  padding: 0.2em 0;
  background-color: #fff;
`

function ContentModal(props) {
  
  const editHandler = () => {

  }
  
  const deleteHandler = () => {

  }

  return(
    <Fragment>
      <Div>
        <Div2>
          <SubmitButton text='수정' type='skyblue' onClick={editHandler}/>
        </Div2>
        <Div2>
          <SubmitButton text='삭제' type='red' onClick={deleteHandler}/>
        </Div2>
        <Div2>
          <SubmitButton text='취소' type='black' onClick={() => {props.setContentMenu(false)}} />
        </Div2>
      </Div>
    </Fragment>
  )
}

export default ContentModal