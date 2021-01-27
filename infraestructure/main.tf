provider "aws" {
  profile = "naxu"
  region  = "us-east-2"
}
module "buckets" {
  source = "./buckets"
}
