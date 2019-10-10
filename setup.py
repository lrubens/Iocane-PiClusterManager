from setuptools import setup, find_packages

setup(
    name='IocaneClusterManager',
    version='1.0.0',
    url='https://github.com/IocaneClusterManager.git',
    author='Rubens Lacouture',
    author_email='lacouture.r@husky.neu.edu',
    description='Web interface for interacting with a raspberry pi cluster, by monitoring node status and submitting jobs via slurm job scheduler',
    packages=find_packages(),    
    install_requires=['flask', 'flask_cors', 'flask_restful', 'livereload', 'paramiko'],
)
