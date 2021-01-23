import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip, Table, Image, Container, Badge, Button } from "react-bootstrap";
import classNames from 'classnames'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import ImageCarousel from './ImageCarousel'

const Tables = (props) => {

  const [carousel, setCarousel] = useState(false)
  const [carouselIndex, setCIndex] = useState(0)

  let turnOnCarousel = (index, state) => {
    setCIndex(index)
    setCarousel(true)
  }

  let trunOffCarousel = () => {
    setCarousel(false)
  }

  let renderToolTipForVersion = (individual, item) => {
    let version = individual[item]
    return `Version: ${version}`
  }

  let imgSrc = (uuid, folderNum, index) => {
    return `http://localhost:5000/img/${uuid}/${folderNum}/${index}.png`
  }

  const year = new Date().getFullYear()

  let googleScanLink = (individual, item) => {
    let version = individual[item]
    if (version === 'null') {
      return `https://www.google.com/search?q=${item}+${year}+CVE`
    }
    else {
      return `https://www.google.com/search?q=${item}+${version}+CVE`
    }
  }

  let ipLookupLink = (ip) => {
    return `https://whatismyipaddress.com/ip/${ip}`
  }

  let renderToolTip = (individual, item) => {
    let banner = individual[item]
    if (banner !== "") {
      return `Banner: ${banner}`
    }
    else {
      let portInfos = {
        21: 'ftp',
        22: 'ssh',
        23: 'telnet',
        25: 'smtp',
        53: 'DNS',
        80: 'http',
        110: 'pop3',
        111: 'rpcbin',
        135: 'msrpc',
        139: 'netbios-ssn',
        143: 'imap',
        443: 'https',
        445: 'microsoft-ds',
        993: 'imapc',
        995: 'pop3s',
        1723: 'pptp',
        3306: 'mysql',
        3389: 'ms-wbt-server',
        5900: 'vnc',
        8080: 'http-proxy'
      }

      return `Usually: ${portInfos[`${item}`]}`
    }
  }
  let findStatusColor = (code) => {
    if (code.charAt(0) === `2`) {
      return `success`
    }
    if (code.charAt(0) === `1`) {
      return `info`
    }
    if (code.charAt(0) === `3`) {
      return `warning`
    }
    if (code.charAt(0) === `4`) {
      return `danger`
    }
    if (code.charAt(0) === `5`) {
      return `danger`
    }
  }

  let protLinkMaker = (port) => {
    return `https://www.speedguide.net/port.php?port=${port}`
  }


  return (
    <>
      <div className='p-5 animate__animated animate__fadeInUpBig'>
        <Container fluid
          className="mt-4">
          <div className={classNames("table", "overflow-auto")}>
            <Table stripped='true' hover variant="dark" rounded='true'>

              <thead className="sticky-table-thead">
                <tr>
                  <th>URL</th>
                  <th>IP</th>
                  <th>STATUS</th>
                  <th>PORTS</th>
                  <th>CONTENT LENGTH</th>
                  <th>PAGE TITLE</th>
                  <th>TECH</th>
                  <th>SCREENSHOT</th>
                </tr>
              </thead>

              <tbody>
                {props.data.scanResponse.map((individual, index) => {
                  return (
                    <tr key={individual[`id`]}>
                      <td><a href={individual[`url`]} rel="noopener noreferrer" target='_blank'>{individual[`url`]}</a></td>
                      <td><a href={ipLookupLink(individual[`ip`])} rel="noopener noreferrer" target='_blank'>{individual[`ip`]}</a></td>

                      <td><Badge pill variant={findStatusColor(individual[`status`])} className="m-1">{individual[`status`]}</Badge></td>

                      <td>{Object.keys(individual[`port`]).map((port, index) => {
                        return (
                          <OverlayTrigger
                            key={index}
                            placement="right"
                            overlay={<Tooltip id="tooltip-disabled">{renderToolTip(individual[`port`], port)}</Tooltip>}>
                            <span className="d-inline-block">
                              <a target="_blank" rel="noreferrer" href={protLinkMaker(port)}>
                                <Badge pill variant="success" className="m-1">
                                  {port}
                                </Badge>
                              </a>
                            </span>
                          </OverlayTrigger>)
                      })}
                      </td>

                      <td>{individual[`contentLength`]}</td>
                      <td>{individual[`pageTitle`]}</td>

                      <td>
                        {Object.keys(individual[`tech`]).map((product, index) => {
                          return (

                            <OverlayTrigger
                              placement="right"
                              key={index}
                              overlay={<Tooltip id="tooltip-disabled">{renderToolTipForVersion(individual[`tech`], product)}</Tooltip>}>
                              <span className="d-inline-block">
                                <a target="_blank" rel="noreferrer" href={googleScanLink(individual[`tech`], product)} >
                                  <Badge pill variant="info" className="m-1">
                                    {product}
                                  </Badge>
                                </a>
                              </span>
                            </OverlayTrigger>

                          )
                        })}
                      </td>
                      <td>
                        <Image
                          className="imageFix"
                          rounded
                          src={imgSrc(props.uuid, props.data.folderNum, index)}
                          onClick={() => {
                            turnOnCarousel(index, true)
                          }}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>

          </div>

        </Container>
      </div>
      <Container className="carousel-container">
        {carousel ? <Button onClick={trunOffCarousel} variant='outline-danger'><FontAwesomeIcon icon={faWindowClose} /></Button> : null}
        {carousel ? <ImageCarousel data={props.data} uuid={props.uuid} folderNum={props.data.folderNum} index={carouselIndex} /> : null}
      </Container>
    </>
  );
}

export default Tables;
