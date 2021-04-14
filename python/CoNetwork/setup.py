from __future__ import absolute_import, print_function
import sys
from setuptools import setup, find_packages

import py_network as module

WINDOWS = sys.platform.lower().startswith("win")
LINUX = sys.platform.lower().startswith("linux")


requires = (
    'django>=2.0,<3',
    'mysqlclient',
    'pillow == 5.0.0',
    'channels>=2.0.0',
    'channels_redis'
)


setup(
    name=module.__name__.replace("_", "-"),
    version=module.__version__,
    author=module.__author__,
    author_email=module.team_email,
    license=module.package_license,
    description=module.package_info,
    platforms="all",
    long_description=open('README.md').read(),
    packages=find_packages(exclude=('tests', 'buildsystem', 'examples')),
    install_requires=requires,
    extras_require={
        'develop':
            [
                'coverage!=4.3',
                'pylama',
                'pytest',
                'pytest-cov',
                'tox>=2.4',
                'mypy==0.511',
            ]
    }
)
