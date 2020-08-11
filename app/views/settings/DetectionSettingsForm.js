import React from 'react'
import { observer } from "mobx-react-lite"

import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CDataTable,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CSelect,
  CSwitch,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const uuidv4 = require("uuid/v4")

const channelFields = [
  { key: 'Type', _style: { width: '50%'} },
  {
    key: 'toggle',
    label: '',
    _style: { width: '10%' },
    sorter: false,
    filter: false
  }
]

const getChannelBadge = (Type)=>{
  switch (Type) {
    case 'DIC': return 'secondary'
    case 'Green': return 'success'
    case 'Red': return 'danger'
    default: return 'primary'
  }
}

const DetectionSettingsForm = (props) => {
  const [modalAdd, setModalAdd] = React.useState(false)
  const [modalRemove, setModalRemove] = React.useState(false)
  const [NameInput, setNameInput] = React.useState("")
  const [selectPresetValue, setselectPresetValue] = React.useState("a809ff23-4235-484f-86f2-e5d87da8333d")

  const [toasts, setToasts] = React.useState([
    {}
  ])

  const toasters = (()=>{
    return toasts.reduce((toasters, toast) => {
      toasters[toast.position] = toasters[toast.position] || []
      toasters[toast.position].push(toast)
      return toasters
    }, {})
  })()

  const addToast = (header, body) => {
    setToasts([
      ...toasts, 
      { autohide: true && 2000, closeButton:true, fade:true, header:header, body:body, show:true }
    ])
  }
  
  const array_move = (arr, old_index, new_index) => {
    if (new_index <= arr.length) {
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    }
  };

  const handleUp = (index) => {
    if (index-1 >= 0) {
      array_move(props.props.get(selectPresetValue).channels, index, index-1)
      props.props.get(selectPresetValue).channels = [...props.props.get(selectPresetValue).channels]
    } 
  };

  const handleDown = (index) => {
    if (index+1 <= props.props.get(selectPresetValue).channels.length) {
      array_move(props.props.get(selectPresetValue).channels, index, index+1)
      props.props.get(selectPresetValue).channels = [...props.props.get(selectPresetValue).channels]
    }
  };

  const switchStack = () => {
    if (props.props.get(selectPresetValue).zstack === true) {
      props.props.get(selectPresetValue).zstack = false
    }
    else {
      props.props.get(selectPresetValue).zstack = true
    }
  }

  const switchVideo = () => {
    if (props.props.get(selectPresetValue).video === true) {
      props.props.get(selectPresetValue).video = false
    }
    else {
      props.props.get(selectPresetValue).video = true
    }
  }

  const switchVideoSplit = () => {
    if (props.props.get(selectPresetValue).videoSplit === true) {
      props.props.get(selectPresetValue).videoSplit = false
    }
    else {
      props.props.get(selectPresetValue).videoSplit = true
    }
  }

  const handleAddPreset = () => {
    setModalAdd(false)

    const id = uuidv4()
    props.props.set(id, {
      name: NameInput,
      channels: [
        {"Type":"DIC","index":0},
        {"Type":"Red","index":1},
        {"Type":"Green","index":2}
      ],
      boxsize: 200,
      video: false,
      videoSplit: true 
    })

    setselectPresetValue(id)
  };

  const handleRemovePreset = async () => {
    if (selectPresetValue !== "a809ff23-4235-484f-86f2-e5d87da8333d") {
      setModalRemove(false)
      props.props.delete(selectPresetValue)
      setselectPresetValue("a809ff23-4235-484f-86f2-e5d87da8333d")   
    }
    else {
      setModalRemove(false)
      addToast('Error', 'Default preset can not be deleted.');
    }
  }; 

  return (
    <>
      <CCard>
        <CCardHeader>Detection Settings</CCardHeader>
        <CCardBody >
          <CForm encType="multipart/form-data" className="form-horizontal">
            <CFormGroup>
              <CLabel>Select Detection Preset</CLabel>
              <CSelect value={selectPresetValue} onChange={(event) => setselectPresetValue(event.currentTarget.value)} custom id="selectPreset">
                {Array.from( props.props ).map(([key, value]) => {
                  return props.props.get(key).name &&
                  (<option
                  value={key}
                  name={props.props.get(key).name}
                  >
                    {props.props.get(key).name}
                  </option>
                )})}
              </CSelect>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="5">
                  <CLabel>Detection on z-stacks?</CLabel>
              </CCol>
              <CCol md="5">
                <CFormGroup>
                  <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchStack} checked={props.props.get(selectPresetValue).zstack} id="stackYes"/>
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="5">
                  <CLabel>Detection on videos?</CLabel>
              </CCol>
              <CCol md="5">
                <CFormGroup>
                  <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchVideo} checked={props.props.get(selectPresetValue).video} id="videoYes"/>
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="5">
                  <CLabel>Split videos into single files?</CLabel>
              </CCol>
              <CCol md="5">
                <CFormGroup>
                  <CSwitch className={'mx-1'} variant={'3d'} color={'primary'} onChange={switchVideoSplit} checked={props.props.get(selectPresetValue).videoSplit} id="videoSplitYes"/>
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="2">
                  <CLabel>Box size</CLabel>
              </CCol>
              <CCol sm="1">
              </CCol>
            </CFormGroup>
            <CFormGroup>
              <CDataTable
              items={props.props.get(selectPresetValue).channels}
              fields={channelFields}
              itemsPerPage={10}
              hover
              scopedSlots = {{
                'Type':
                  (item)=>(
                    <td>
                      <CBadge color={getChannelBadge(item.Type)}>
                        {item.Type}
                      </CBadge>
                    </td>
                  ),
                  'toggle':
                    (item, index)=>{
                      return (
                        <CButtonGroup>
                          <CButton onClick={()=>{handleUp(index)}} color="dark" size="sm" variant="outline">
                            <FontAwesomeIcon icon="arrow-up" />   Move Up
                          </CButton>
                          <CButton onClick={()=>{handleDown(index)}} color="dark" size="sm" variant="outline">
                            <FontAwesomeIcon icon="arrow-down" />   Move Down
                          </CButton>
                        </CButtonGroup>
                    )
                  }
                }}
              />
            </CFormGroup>
          </CForm>
          <CModal 
              show={modalAdd} 
              onClose={setModalAdd}
          >
            <CModalHeader closeButton>
              <CModalTitle>Set preset name.</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CInput id="nameInput" onChange={(event) => setNameInput(event.currentTarget.value)} value={NameInput}></CInput>
            </CModalBody>
            <CModalFooter>
              <CButton onClick={handleAddPreset} color="primary"><FontAwesomeIcon icon="plus" />   Add Preset</CButton>{' '}
              <CButton 
                color="secondary" 
                onClick={() => setModalAdd(false)}
              ><FontAwesomeIcon icon="undo" />   Cancel</CButton>
            </CModalFooter>
          </CModal>
          <CModal 
              show={modalRemove} 
              onClose={setModalRemove}
          >
            <CModalHeader closeButton>
              <CModalTitle>Delete preset?</CModalTitle>
            </CModalHeader>
            <CModalFooter>
              <CButton onClick={handleRemovePreset} color="danger"><FontAwesomeIcon icon="exclamation" />   Delete Preset</CButton>{' '}
              <CButton 
                color="secondary" 
                onClick={() => setModalRemove(false)}
              ><FontAwesomeIcon icon="undo" />   Cancel</CButton>
            </CModalFooter>
          </CModal>
          {Object.keys(toasters).map((toasterKey) => (
            <CToaster
              position='top-right'
              key={'toaster' + toasterKey}
            >
              {
                toasters[toasterKey].map((toast, key)=>{
                return(
                  <CToast
                    key={'toast' + key}
                    show={toast.show}
                    autohide={toast.autohide}
                    fade={toast.fade}
                  >
                  <CToastHeader closeButton={toast.closeButton}>
                    {toast.header}
                  </CToastHeader>
                  <CToastBody >
                    {toast.body}
                  </CToastBody>
              </CToast>
              )
            })
            }
          </CToaster>
          ))}
        </CCardBody>
        <CCardFooter>
          <CButton type="add" onClick={setModalAdd} size="sm" color="success"><FontAwesomeIcon icon="plus" /> Add new preset</CButton>
          <CButton type="add" onClick={setModalRemove} size="sm" color="danger"><FontAwesomeIcon icon="ban" /> Remove current preset</CButton>
        </CCardFooter>
      </CCard>
    </>
  )
}

export default observer(DetectionSettingsForm)
