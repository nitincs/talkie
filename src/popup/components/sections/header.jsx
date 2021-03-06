/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

Talkie is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Talkie is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Talkie.  If not, see <https://www.gnu.org/licenses/>.
*/

import React from "react";
import PropTypes from "prop-types";

import configureAttribute from "../../../shared/hocs/configure.jsx";
import translateAttribute from "../../../shared/hocs/translate.jsx";
import styled from "../../../shared/hocs/styled.jsx";

import * as layoutBase from "../../../shared/styled/layout/layout-base.jsx";
import * as textBase from "../../../shared/styled/text/text-base.jsx";
import * as buttonBase from "../../../shared/styled/button/button-base.jsx";

import Discretional from "../../../shared/components/discretional.jsx";
import TalkieVersionIcon from "../../../shared/components/icon/talkie-version-icon.jsx";

@configureAttribute
@translateAttribute
export default class Header extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handlePlayPauseClick = this.handlePlayPauseClick.bind(this);

        this.styled = {
            extensionName: styled({
                fontWeight: "bold",
                textDecoration: "none",
                ":focus": {
                    outline: 0,
                },
            })(textBase.a),

            button: styled({
                lineHeight: "1.5em",
                // float: __MSG_@@bidi_end_edge__;
                ":focus": {
                    outline: 0,
                },
            })(buttonBase.a),
        };
    }

    static defaultProps={
        isPremiumVersion: false,
    }

    static propTypes = {
        playPauseClick: PropTypes.func.isRequired,
        isPremiumVersion: PropTypes.bool.isRequired,
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    }

    handlePlayPauseClick(e) {
        e.preventDefault();
        e.stopPropagation();

        this.props.playPauseClick();

        return false;
    }

    render() {
        const {
            isPremiumVersion,
            configure,
            translate,
        } = this.props;

        return (
            <layoutBase.header>
                {/* TODO: show for free Talkie, not for Talkie Premium. */}
                <Discretional
                    enabled={!isPremiumVersion}
                >
                    <this.styled.button
                        href={configure("urls.store-premium")}
                        id="header-premium-button"
                        lang="en"
                    >
                        {translate("extensionShortName_Premium")}
                    </this.styled.button>
                </Discretional>

                <textBase.span
                    onClick={this.handlePlayPauseClick}
                >
                    <TalkieVersionIcon
                        isPremiumVersion={isPremiumVersion}
                    />
                </textBase.span>

                <this.styled.extensionName
                    href={configure("urls.main")}
                    lang="en"
                >
                    {translate("extensionShortName")}
                </this.styled.extensionName>
            </layoutBase.header>
        );
    }
}
