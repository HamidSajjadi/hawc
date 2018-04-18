import $ from '$';
import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import fetch from 'isomorphic-fetch';

import 'react-tabs/style/react-tabs.css';
import 'react-select/dist/react-select.css';

import h from 'shared/utils/helpers';
import { splitStartup } from 'utils/WebpackSplit';
import HAWCUtils from 'utils/HAWCUtils';
import Loading from 'shared/components/Loading';

class BaseVisualForm extends Component {
    constructor(props) {
        super(props);
        this.config = JSON.parse(document.getElementById('config').textContent);
        this.state = {
            caption: '',
            dataRefreshRequired: true,
            dose_units: null,
            endpoints: [],
            loaded: false,
            prefilters: {},
            published: '',
            settings: 'undefined',
            slug: '',
            title: '',
            visual_type: this.config.visual_type,
        };
    }

    componentDidMount() {
        if (this.config.crud == 'Update') {
            fetch(`${this.config.data_url}${this.config.instance.id}`, h.fetchGet)
                .then((response) => response.json())
                .then((json) => {
                    let { settings, ...data } = json,
                        state = this.formatIncoming(data);
                    this.setState({
                        loaded: true,
                        visual_type: this.config.visual_type,
                        settings: JSON.stringify(settings),
                        ...state,
                    });
                });
        }
    }

    formatForMultiselect = (arr, valueKey, labelKey) => {
        return arr.map((el) => {
            return { value: el[valueKey], label: el[labelKey] };
        });
    };

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, dataRefreshRequired: true });
    };

    handleCheckboxChange = (e) => {
        this.setState({ [e.target.name]: e.target.checked, dataRefreshRequired: true });
    };

    handleDoseUnitSelect = (value) => {
        this.setState({ dose_units: parseInt(value), dataRefreshRequired: true });
    };

    handleTitleChange = (e) => {
        // When creating a new visual, the slug automatically changes w/ the
        // title. However, if updating, the slug does not change automatically.
        let title = e.target.value,
            newState = {
                title,
                dataRefreshRequired: true,
            };

        if (this.config.crud === 'Create') {
            newState.slug = HAWCUtils.urlify(title);
        }
        this.setState(newState);
    };

    handleTabSelection = (tabIndex) => {
        // Get new data for chart if a user clicks the preview tab and
        // the data has changed.
        if (tabIndex === 2 && this.state.dataRefreshRequired) {
            fetch(this.config.preview_url, h.fetchForm(this.config.csrf, this.form))
                .then((response) => response.json())
                .then((json) => this.updatePreviewGraph(json))
                .then(() => this.setState({ dataRefreshRequired: false }));
        }
    };

    formatIncoming(json) {
        return HAWCUtils.abstractMethod();
    }

    renderForm() {
        return HAWCUtils.abstractMethod();
    }

    renderSettingsForm() {
        return HAWCUtils.abstractMethod();
    }

    updatePreviewGraph(json) {
        return HAWCUtils.abstractMethod();
    }

    render() {
        if (!this.state.loaded) {
            return <Loading />;
        }

        return (
            <Tabs onSelect={this.handleTabSelection}>
                <TabList>
                    <Tab>Visualization settings</Tab>
                    <Tab>Figure customization</Tab>
                    <Tab>Preview</Tab>
                </TabList>

                <form ref={(form) => (this.form = form)} method="POST" id="visualForm">
                    <TabPanel>
                        <input type="hidden" name="csrfmiddlewaretoken" value={this.config.csrf} />
                        <legend>
                            {this.config.crud} {this.state.title}
                        </legend>
                        <p>{this.config.crud} a visualization</p>
                        <br />
                        {this.renderForm()}
                    </TabPanel>
                    <TabPanel>{this.renderSettingsForm()}</TabPanel>
                    <TabPanel forceRender>
                        <div ref={(preview) => (this.preview = preview)} />
                    </TabPanel>
                    <div className="form-actions">
                        <input
                            type="submit"
                            name="save"
                            value="Save"
                            className="btn btn-primary"
                            id="submit-id-save"
                        />
                        <a role="button" className="btn btn-default" href={this.config.cancel_url}>
                            Cancel
                        </a>
                    </div>
                </form>
            </Tabs>
        );
    }
}

BaseVisualForm.propTypes = {};

export default BaseVisualForm;

const formRender = (element) => {
    splitStartup(element, BaseVisualForm);
};

export { formRender };