import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { getConcurrent } from 'store/selectors'

import { Footer, Button, Concurrent } from 'components'

import { utils } from 'styles'

const StyledDiv = styled.div`
  ${ props => utils.flexBox(props) }
  border-top: 1px solid ${ props => props.theme.color.border };
  padding-top: 5px;
`

const TodoFooter = ({ onClick, conUsers }) => {
  return (
    <StyledDiv center row>
      <Footer text='Created by'/>
      <Concurrent users={ conUsers }/>
      <Button
        name='Clear Completed'
        onClick={ onClick }
      />
    </StyledDiv>
  )
}


TodoFooter.propTypes = {
  onClick: PropTypes.func,
  conUsers: PropTypes.number,
}

// Selector Pattern with reselect
const s = (state, props) => ({
  conUsers: getConcurrent(state, props),
})

const d = dispatch => ({

})
export default connect(s, d)(TodoFooter)
