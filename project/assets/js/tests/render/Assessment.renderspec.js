import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Assessment from '../../components/Assessment';
import unexpected from 'unexpected';
import unexpectedReact from 'unexpected-react';

const expect = unexpected.clone().use(unexpectedReact);

describe('Assessment component', () => {
    let items, name, renderer, output;

    beforeEach(() => {
        items = [
            {
                "count": 334,
                "type": "epi",
                "title": "epidemiological outcomes assessed",
                "url": "http://127.0.0.1:8000/epi/api/cleanup/?assessment_id=57"
            },
            {
                "count": 1,
                "title": "in vitro endpoints",
                "type": "iv",
                "url": "http://127.0.0.1:9000/in-vitro/api/cleanup/?assessment_id=57",
            },
        ];
        name = "test assessment";

        renderer = TestUtils.createRenderer();
        renderer.render(<Assessment items={items} name={name} />);
        output = renderer.getRenderOutput();
    });

    it('should render with a correct class name', () => {
        expect(output.props.className, 'to equal', 'assessment');
    });

    it('should have a list title', () => {
        expect(output.props.children[0].props.children.join(''), 'to equal', 'test assessment Results for Cleanup');
    });

    it('should render two endpoint types', () => {
        expect(output.props.children[1].props.children.length, 'to equal', 2);
    });

});
