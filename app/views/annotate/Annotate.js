import React from 'react'

import { observer } from "mobx-react-lite"
const path = require('path');
const { dialog } = require('electron').remote;
const { ipcRenderer } = require('electron')

import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CForm,
  CFormGroup,
  CInput,
  CInputGroupAppend,
  CLabel,
  CSelect,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Annotate = (props) => {
  const handleAddPathClick = () => {
    var selectedPath = dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (typeof path !== 'undefined') {
      setPathInput(selectedPath[0])
    }
  };

  const setPathInput = (value) => {
    props.props.set('path', value)
  }

  const submitJob = () => {
    ipcRenderer.send('start-napari')
  };

  return (
    <>
      <CCard>
        <CCardHeader>
          Annotate and correct your data!
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CFormGroup>
              <CLabel>Path:</CLabel>
              <CInputGroupAppend>
                <CInput id="pathInput" onChange={(event) => setPathInput(event.currentTarget.value)} value={props.props.get('path')}></CInput>
                <CButton onClick={handleAddPathClick} size="sm" color="primary"><FontAwesomeIcon icon="plus" /> Select Path</CButton>
              </CInputGroupAppend>
            </CFormGroup>
          </CForm>
        </CCardBody>
        <CCardFooter>
          <CButton type="add" onClick={submitJob} size="sm" color="success"><FontAwesomeIcon icon="plus" /> Start annotation process.</CButton>
        </CCardFooter>
      </CCard>
    </>
  )
}

export default observer(Annotate)